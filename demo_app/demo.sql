create table `users` (
    `id` binary(36) primary key not null,
    `username` varchar(255) not null,
    `password` varchar(255) not null,
    `name` varchar(255) not null,
    `gender` enum('male', 'female'),
    `created` datetime
);
create table `posts` (
    `id` binary(36) primary key not null,
    `title` varchar(255) not null,
    `content` varchar(255) not null,
    `user_id` binary(36) not null,
    `created` datetime,
    foreign key (`user_id`) references `users`(`id`)

);
insert into `users` (`id`, `username`, `name`, `gender`, `created`) values (
    'b1818b2a-0196-49a8-a502-a2b3b8203080', 'chuongdlb', 'Chương Đặng', 'male', now()
);

--- Tạo user để kết nối từ nodejs backend tới mysql
create user 'newuser'@'localhost' identified by '12345';
grant all PRIVILEGES on *.* to 'newuser'@'localhost';
flush privileges;
  

