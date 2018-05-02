use sakila

# 1a. Display the first and last names of all actors from the table `actor`. 

SELECT first_name,last_name 
from actor;

# 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column `Actor Name`. 
SELECT concat(first_name, ' ',last_name) as 'Actor Name'
from actor;


# 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
  
select actor_id , first_name, last_name
from actor
where first_name = 'Joe';

# 2b. Find all actors whose last name contain the letters `GEN`:
select first_name, last_name 
from actor
where last_name like '%GEN%';
  	
# 2c. Find all actors whose last names contain the letters `LI`. This time, order the rows by last name and first name, in that order:
select last_name , first_name
from actor
where last_name like '%LI%'
order by last_name;

# 2d. Using `IN`, display the `country_id` and `country` columns of the following countries: Afghanistan, Bangladesh, and China:

select country_id, country
from country
where country in ('Afghanistan', 'Bangladesh','China');

# 3a. Add a `middle_name` column to the table `actor`. Position it between `first_name` and `last_name`. Hint: you will need to specify the data type.

ALTER TABLE actor
ADD middle_name VARCHAR(30) after first_name;

# 3b. You realize that some of these actors have tremendously long last names. Change the data type of the `middle_name` column to `blobs`.
ALTER table actor
modify middle_name blob;

# 3c. Now delete the `middle_name` column.
ALTER table actor
drop column middle_name;

# 4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(*) as count 
from actor     
Group by last_name 
Order by count desc;

# 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
select last_name, count(*) as count 
from actor     
Group by last_name 
HAVING COUNT(*) > 1 
Order by count desc ;

# 4c. Oh, no! The actor `HARPO WILLIAMS` was accidentally entered in the `actor` table as `GROUCHO WILLIAMS`, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.


update actor
set first_name = 'HARPO'
where (last_name = 'Williams') and (first_name = 'GROUCHO'); 

# 4d. Perhaps we were too hasty in changing `GROUCHO` to `HARPO`. 
#It turns out that `GROUCHO` was the correct name after all! 
#In a single query, if the first name of the actor is currently `HARPO`, 
#change it to `GROUCHO`. Otherwise, change the first name to `MUCHO GROUCHO`, 
#as that is exactly what the actor will be with the grievous error. 
#BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO `MUCHO GROUCHO`, HOWEVER! (Hint: update the record using a unique identifier.)
update actor
set first_name = 'GROUCHO'
where (last_name = 'Williams') and (first_name = 'HARPO'); 

# 5a. You cannot locate the schema of the `address` table. Which query would you use to re-create it? 

#SHOW CREATE TABLE tbl_name
show create table address;

  # Hint: [https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html](https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html)

# 6a. Use `JOIN` to display the first and last names, as well as the address, of each staff member. Use the tables `staff` and `address`:

Select staff.first_name, staff.last_name, address.address
from staff
inner join address on staff.address_id=address.address_id;

# 6b. Use `JOIN` to display the total amount rung up by each staff member in August of 2005. Use tables `staff` and `payment`. 
 
Select staff.first_name, staff.last_name, 
	sum(payment.amount) as sales
	from staff
	inner join payment on staff.staff_id=payment.staff_id 
group by staff.staff_id;

# 6c. List each film and the number of actors who are listed for that film. 
# Use tables `film_actor` and `film`. Use inner join.
Select film.title, 
count(*) as num_actors
from film_actor
inner join film on film_actor.film_id = film.film_id
group by film_actor.film_id;

# 6d. How many copies of the film `Hunchback Impossible` exist in the inventory system?
select count(*) 
from film
inner join inventory on film.film_id = inventory.film_id
where (title = 'HUNCHBACK IMPOSSIBLE');

# 6e. Using the tables `payment` and `customer` and the `JOIN` command, 
#list the total paid by each customer. List the customers alphabetically by last name:
select customer.first_name, customer.last_name , sum(payment.amount) 
from customer
inner join payment on payment.customer_id = customer.customer_id
group by customer.customer_id
order by customer.last_name;
 
 # ```
 # 	![Total amount paid](Images/total_payment.png)
 # ```

# 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters `K` and `Q` have also soared in popularity. Use subqueries to display the titles of movies starting with the letters `K` and `Q` whose language is English. 
select film.title
from film
inner join language on film.language_id = language.language_id
where ((film.title like 'K%') or (film.title like 'Q%')) and (language.name = 'english') ;

# 7b. Use subqueries to display all actors who appear in the film `Alone Trip`.
select actor.last_name, actor.first_name 
from actor 
where actor.actor_id in  
	(select film_actor.actor_id
	from film_actor
	where film_actor.film_id = 
		(select film.film_id   #select films w/ title of 'Alone Trip'
		from film
		where film.title = 'Alone Trip'));
        
# 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.se
select first_name, last_name, email  #display the emails for people with physical address in Canada
from customer
where address_id in 
	(
    select address_id #find all the address with cities in Canada
	from address
	where city_id in 
		(select city_id  #find all the cities with Candian coutry code.
		from city
		where city.country_id =
			(select country_id   #find the country ID for Canada
			from country
			where country = 'Canada'
            )
		)
	);
    
# 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. 
#Identify all movies categorized as famiy films.
select title  # covert the film_id's into film titles
from film
where film_id in 
	(select film_id   #find all the film_ids with a catagory equal to family
	from film_category
	where category_id = 
		(select category_id  #find the catagory id for 'family'
		from category
		where name = 'Family')
	);

# 7e. Display the most frequently rented movies in descending order.
select film.title , count(film.film_id)
from payment
inner join rental on payment.rental_id = rental.rental_id
inner join inventory on rental.inventory_id = inventory.inventory_id
inner join film on inventory.film_id = film.film_id
group by film.film_id
order by count(film.film_id) DESC
;

# 7f. Write a query to display how much business, in dollars, each store brought in.
select store.store_id, sum(payment.amount)
from payment 
inner join rental on payment.rental_id = rental.rental_id
inner join inventory on rental.inventory_id = inventory.inventory_id
inner join store on inventory.store_id = store.store_id
group by inventory.store_id;

#sanity check query on the total payments.  The sum of the stores should equal this amount.
select sum(payment.amount)
from payment;

# 7g. Write a query to display for each store its store ID, city, and country.
select 
	store.store_id, 
    city.city,
    country.country
from address
inner join city on address.city_id = city.city_id 
inner join store on address.address_id = store.address_id
inner join country on city.country_id = country.country_id
; 

# 7h. List the top five genres in gross revenue in descending order. 
#(##Hint##: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select 
    category.name,
    sum(payment.amount)
from payment 
inner join rental        on payment.rental_id          = rental.rental_id
inner join inventory     on rental.inventory_id        = inventory.inventory_id
inner join film          on inventory.film_id          = film.film_id
inner join film_category on film.film_id               = film_category.film_id
inner join category      on film_category.category_id  = category.category_id
group by category.name
order by sum(payment.amount) DESC
limit 5;
                        
# 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
#Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
create view top_cats as 
select 
    category.name,
    sum(payment.amount)
from payment 
inner join rental        on payment.rental_id          = rental.rental_id
inner join inventory     on rental.inventory_id        = inventory.inventory_id
inner join film          on inventory.film_id          = film.film_id
inner join film_category on film.film_id               = film_category.film_id
inner join category      on film_category.category_id  = category.category_id
group by category.name
order by sum(payment.amount) DESC
limit 5
;
# 8b. How would you display the view that you created in 8a?
select * from top_cats; 

# 8c. You find that you no longer need the view `top_five_genres`. Write a query to delete it.
drop view top_cats;
