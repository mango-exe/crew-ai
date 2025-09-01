ALTER TABLE `conversations` ADD `description` varchar(255);--> statement-breakpoint
ALTER TABLE `llm_models` ADD `isMultiModal` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `llms` ADD `isDefault` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_alias_unique` UNIQUE(`alias`);