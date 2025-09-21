import { relations } from "drizzle-orm/relations";
import { users, clients, clientRepositories, projects, projectAttachments } from "./schema";

export const clientsRelations = relations(clients, ({one, many}) => ({
	user: one(users, {
		fields: [clients.ownerUserId],
		references: [users.id]
	}),
	clientRepositories: many(clientRepositories),
	projects: many(projects),
}));

export const usersRelations = relations(users, ({many}) => ({
	clients: many(clients),
}));

export const clientRepositoriesRelations = relations(clientRepositories, ({one}) => ({
	client: one(clients, {
		fields: [clientRepositories.clientId],
		references: [clients.id]
	}),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	client: one(clients, {
		fields: [projects.clientId],
		references: [clients.id]
	}),
	projectAttachments: many(projectAttachments),
}));

export const projectAttachmentsRelations = relations(projectAttachments, ({one}) => ({
	project: one(projects, {
		fields: [projectAttachments.projectId],
		references: [projects.id]
	}),
}));