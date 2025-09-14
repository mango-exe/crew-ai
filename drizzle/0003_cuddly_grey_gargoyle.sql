CREATE TABLE `user-llm-preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`llm` int NOT NULL,
	`llmModel` int NOT NULL DEFAULT 2,
	`isDefault` boolean NOT NULL DEFAULT false,
	`userId` int NOT NULL,
	CONSTRAINT `user-llm-preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user-llm-preferences_isDefault_unique` UNIQUE(`isDefault`)
);
--> statement-breakpoint
ALTER TABLE `conversations` MODIFY COLUMN `alias` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `llm_models` MODIFY COLUMN `model_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user-llm-preferences` ADD CONSTRAINT `user-llm-preferences_llm_llms_id_fk` FOREIGN KEY (`llm`) REFERENCES `llms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user-llm-preferences` ADD CONSTRAINT `user-llm-preferences_llmModel_llm_models_id_fk` FOREIGN KEY (`llmModel`) REFERENCES `llm_models`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user-llm-preferences` ADD CONSTRAINT `user-llm-preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `llms` DROP COLUMN `isDefault`;