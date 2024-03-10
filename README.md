# UNvote

Welcome to the UNvote, a slightly audacious and arguably necessary tool in the grand tradition of tilting at windmills. Inspired by the works of luminaries like David Graeber, Noam Chomsky, and Yanis Varoufakis, this project aims to dive deep into the heart of the United Nations' effectiveness—or, as we suspect, the lack thereof. Because nothing says "I'm making a difference" quite like a body that gathers annually to agree overwhelmingly on things that rarely change.

## What's This?

This repository contains a Deno script for scraping all [UN voting documents](https://digitallibrary.un.org/search?ln=en&c=Voting+Data&rg=200&jrec=1&fct__2=General+Assembly&cc=Voting+Data&fct__9=Vote) and store them locally in a sqlite3 database. Because, let's face it, if you want something done right (or at all), you're probably going to have to do it yourself. The UN has been churning out resolutions like a factory of good intentions since 1945, and we're here to analyze just how much of a dent all this has made in the real world.

## Why, Though?

I was surprised and slightly annoyed over how difficult it was to query UN's digital library for insights. I wanted to know simple things like "Give me all resolutions where less than 5 countries have voted for (or against)", or "What are resolutions that come up every year, but never change? I found some similar projects and even a service with a REST API, but none were up to date, so I decided to just get all documents myself.

I might turn this into a more usable service one day.

## Features

- **Scraping Efficiency**: Because if we're going to critique inefficiency, we might as well be efficient about it.
- **Database of Disappointment**: A neatly organized SQLite (or Postgresql, if we're feeling fancy) database of voting records, ready to have its data spun into a narrative of well-meaning ineffectuality.

## Getting Started

Ensure you have [Deno](https://deno.land/) and SQLite3 installed on your system to run this project.

1. **Clone the repository:**

```bash
git clone https://github.com/rix1/unvote.git # or gh repo clone rix1/unvote
cd unvote
```

2. **Create the Database Schema:**

Run the following command to create the database and apply the schema:

```bash
sqlite3 un_voting_data.db < schema.sql
```

This command will initialize a new SQLite database according to the `schema.sql` file included in the project repository.

3. **Running the Application:**

To start start scraping the UN voting data, run the following command:

```bash
deno task run
```

By default, the summary scraper will find all voting documents from 1946 - 2023. This can be adjusted with the `STARTING_YEAR` and `ENDING_YEAR` variables in `main.ts`.


## Developing

To start the development server, run the following command:

```bash
deno task dev
```

This starts a process that will watch for changes and reload autmatically.

Note: To avoid waiting for network requests when hot reloading, we've added a simple cache with `localStorage`, when the DEV environment variable is set to `true` (the env variable is automatically set when you start the dev task). If you need to clear/inspect this cache, simply start the Deno REPL from the project root.


### Dataset dumps

- 2024-02-25 13:01 This database currently contains all documents, but no details about votes: https://www.dropbox.com/scl/fi/tlulebkx20agkzyan22vm/un_voting_data.db?rlkey=h15przktgtqnm3sfdvl5uhcco&dl=0

## Contributing

Feel free to fork, submit pull requests, or just angrily vent about the UN in the issues section. All contributions are welcome, especially from fellow cynics and disillusioned idealists.

## Disclaimer

This project is meant for educational and entertainment purposes and is not affiliated with the United Nations or any authors mentioned. It's a passion project by someone who's passionate about pointing out that the emperor is, indeed, not wearing any clothes.

So, strap in, and let's see if we can statistically prove what many have suspected all along: that the UN is excellent at producing paperwork.
