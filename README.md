# Spinnderdex

## Description

Spinnerdex is a web application that allows users to search for and view spinners' social media (Youtube and Twitter)

## API

There are three endpoints in the API:

- `/api/spinner/:name` - returns the Twitter and Youtube links for a spinner with a `GET` request
- `/api/edit/:name` - allows to edit links for a spinner with a `PATCH` request
- `/api/add/:name` - allows to add a new spinner with a `POST` request

*Note* : All spinner names are in lowercase in the database, but the user can enter any case
