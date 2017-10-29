# [ ] IMDB Scraper
    - [x] Web Scraper
        - [x] Scrape from toplist
            - [x] Get next 50
        - [ ] Scrape info for mongoose
            - [x] Title
            - [x] Rating
            - [ ] Release
            - [ ] Rating
            - [ ] Content Rating (Certificate)
            - [ ] Info from separate page
                - [ ] Directors
                - [ ] Writers
                - [ ] Actors
        - [ ] Have it working with mongoose
- [ ] Movie Suggester (Pick a movie, suggest films)
    - [ ] Algorithm for similarity
    - [ ] Front End Single Page Application
- [ ] Spits out Ebay description to paste easy enough for a min wage worker to use

# Latest Picture
![10/28](https://i.imgur.com/iHmy9S4.png)

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

![10/28](https://i.imgur.com/iHmy9S4.png)
The image is page scraping The Shawshank Redemption (love that movie), and list scraping top 250 twice (that means it only displays 50 * 2 because 50 listings per page)
