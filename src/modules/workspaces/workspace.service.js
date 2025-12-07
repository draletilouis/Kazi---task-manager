import prisma from "../../database/prisma.js";

/**
 * Create a new workspace
 * User becomes the owner automatically
 */
export async function createWorkspace(userId, data) {
    const {name} = data;

    // Validate workspace name
    if (!name||name.trim().length === 0) {
        throw new Error("Workspace name is required");
    }

    // Create workspace and add user as owner
    const workspace = await prisma.workspace.create({
        data: {
            name: name.trim(),
            ownerId: userId,
            members: {
                create: { userId: userId,
                role: 'OWNER'  },
            },
        },
    });

    return {
        message: "Workspace created successfully",
        workspace:{
            id: workspace.id,
            name: workspace.name,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
        }
    };

}

/**
 * Get all workspaces where user is a member
 */
export async function getWorkspaces(userId) {
    const memberships = await prisma.workspaceMember.findMany({
        where: { userId: userId },
        include: {
            workspace: true,
        },
    });

    const workspaces = memberships.map((membership) => ({
        id: membership.workspace.id,
        name: membership.workspace.name,
        role: membership.role,
        createdAt: membership.workspace.createdAt,
    }));

    return {workspaces}
}

/**
 * Update workspace name
 * Only admins and owners can update
 */
export async function updateWorkspace(workspaceId, userId, data) {
    const { name } = data;

    // Validate workspace name
    if (!name || name.trim().length === 0) {
        throw new Error("Workspace name is required");
    }

    // Check if user has admin or owner role
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
            role: { in: ['OWNER', 'ADMIN'] }
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to update this workspace");
    }

    // Update workspace
    const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: { name: name.trim() },
    });

    return {
        message: "Workspace updated successfully",
        workspace: {
            id: workspace.id,
            name: workspace.name,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
        }
    };
}

/**
 * Delete workspace
 * Only the owner can delete
 */
export async function deleteWorkspace(workspaceId, userId) {
    // Check if user is the owner
    const membership = await prisma.workspaceMember.findFirst({
        where: {
                workspaceId: workspaceId,
                userId: userId,
                role: 'OWNER'  }
    });

    if (!membership) {
        throw new Error("Only the workspace owner can delete the workspace");
    }

    // Delete all workspace members first
    await prisma.workspaceMember.deleteMany({
        where: { workspaceId: workspaceId }
    });

    // Delete workspace
    await prisma.workspace.delete({
        where: { id: workspaceId },
    });

    return { message: "Workspace deleted successfully" };
}