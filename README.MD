# Film Genie
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

# Latest Picture
![](https://i.imgur.com/B29my5Q.png)

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
