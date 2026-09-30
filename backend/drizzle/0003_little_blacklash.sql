CREATE TABLE `health_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`steps` integer NOT NULL,
	`source` text DEFAULT 'shortcuts' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `health_steps_user_date_key` ON `health_steps` (`user_id`,`date`);