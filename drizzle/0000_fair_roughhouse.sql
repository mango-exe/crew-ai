CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filetype` varchar(255) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`size` float NOT NULL,
	`filepath` varchar(255) NOT NULL,
	`chatId` int NOT NULL,
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`from_user` int,
	`from_model` int,
	`to_user` int,
	`to_model` int,
	`text_content` longtext,
	`timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`conversationId` int NOT NULL,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`alias` varchar(255),
	`enabled` boolean NOT NULL DEFAULT true,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llm_models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`llmId` int NOT NULL,
	`model_name` varchar(255),
	CONSTRAINT `llm_models_id` PRIMARY KEY(`id`),
	CONSTRAINT `llm_models_model_name_unique` UNIQUE(`model_name`)
);
--> statement-breakpoint
CREATE TABLE `llms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `llms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`provider_enum` enum('credentials','google','github') NOT NULL,
	`hashedPassword` varchar(255),
	`enabled` boolean NOT NULL DEFAULT true,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_chatId_chats_id_fk` FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_from_user_users_id_fk` FOREIGN KEY (`from_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_from_model_llm_models_id_fk` FOREIGN KEY (`from_model`) REFERENCES `llm_models`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_to_user_users_id_fk` FOREIGN KEY (`to_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_to_model_llm_models_id_fk` FOREIGN KEY (`to_model`) REFERENCES `llm_models`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_conversationId_conversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `llm_models` ADD CONSTRAINT `llm_models_llmId_llms_id_fk` FOREIGN KEY (`llmId`) REFERENCES `llms`(`id`) ON DELETE no action ON UPDATE no action;