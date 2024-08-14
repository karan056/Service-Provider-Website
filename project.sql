create database pro;

use pro;

create table users (emailid varchar(30) primary key, pwd varchar(30) , usertype varchar(40) , dos date , status int );

select * from users;

update users set status=0 where emailid="cdbjscbsdj@gmail.com" ;

create table cuprofile (emailid varchar(30) primary key , FName varchar(30) ,  contact varchar(15) , address varchar(100) ,  city varchar(30) , state varchar(50) , ppic varchar(300) );

select * from cuprofile;

create table task (rid int primary key auto_increment, emailid varchar(30), cateogory varchar(30) , subcateogory varchar(30), address varchar(30), city varchar(30), taskdone varchar(100),  upto date );


select * from task;
drop table task;