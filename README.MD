# Film Genie
Stores film information from IMDB.com. Information is retrieved manually via scraping by users providing links to movies or links.

Users can search movies they like from the database. Once a movie is chosen, they will be given recommendations to movies similar to the selected title.

![Latest Picture](https://i.imgur.com/sJUMnP5.png)

## Getting Started:
- Start MongoDB
- Run the command "npm run devstart"

## Motivation
When looking up a movie, IMDB and Google did not provide enough related movies.


# Development History
## 2 Parts:
#### Scraper module scrapes imdb lists, and stores each movie into the db
#### A single page web app that displays the data from the db with options to sort them as well as an option to suggest a movie for the viewer.

# Checklist
- [ ] IMDB Scraper
    - [x] Web Scraper
        - [x] Scrape from toplist
            - [x] Get next 50
        - [x] Scrape movie info
            - [x] Title
            - [x] Rating
            - [x] Release
            - [x] Content Rating (Certificate)
            - [x] Info from separate page
                - [x] Directors
                - [x] Writers
                - [x] Actors
        - [x] Have it working with mongoose
        - [ ] No repeats when adding to DB
- [ ] Movie Suggester (Pick a movie, suggest films)
    - [ ] Algorithm for similarity
    - [ ] Front End Single Page Application

# Updates and learning
### 10/26
Writing a crawler from scratch is pretty simple with NodeJS tools.
A major problem encoutered today was that Amazon's captcha was stopping my web scraper scraping!

Further research reveals that web scraping Amazon is not as easy as it seems.
Have decided that I should just sign up for Amazon affiliates, so I can use the product search API.

Decided to just turn this into a scraper for IMDB.

### 10/28
IMDB has zero web crawler protection. I easily scraped all data from IMDB.
I also have most of scraping list functionality down. I did this by using async's waterfall method.

![](https://i.imgur.com/cMCeILV.png)
The image is page scraping The Shawshank Redemption (love that movie), and list scraping top 250 twice (that means it only displays 50 * 2 because 50 listings per page)

### 10/29
Got scraping each page from the list working.

Requesting 50 movies from a list takes a noticeable amount of time (around 10 seconds);
The top list has 250 movies (x5), and getting directors/writers/actors is a separate page (x2). 
So for the top list page (250 movies), it should take around 100 seconds. Oh man!

I'm worried how I will get the actors/directors/writers (each independent of each other) to work with the movies. Hopefully my experience with CouchDB is good enough.

![](https://i.imgur.com/B29my5Q.png)
Got scraping cast page working (just did actors for now)
At the moment, the code needs some serious refactoring, I might do it right before I implement mongoose

### 10/31
Scraping to mongoose implemented, it was pretty easy. Did not sleep- it seems like I found the formula to everlasting energy: coffee and 30 minute naps.
Code looks pretty messy, but I can't see any ways to refactor on the top of my head. Maybe when I get more familiar with this framework.

### 11/22
![](https://i.imgur.com/iIehm0p.png)
Back to working on this project. Separated the index and scraping page. Got Jquery autocomplete working.

### 11/26-28
![](https://i.imgur.com/sJUMnP5.png)
Used bootstrap to make the pages look much smoother. Learning jQuery while implementing them to site.  In this picture, the /add or scraping page now only contains a "Scrape Button" and sends a post request with ajax which will scrape IMDB.
When finished the page will display a table of the movies scraped.
