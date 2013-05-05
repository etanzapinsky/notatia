notatia
=======

Our Stack
---------
We use Django as our webserver which maintains user login and
authentication, mysql as our relational data store and the
django-haystack plugin on top of elastic search to provide
search. The backend is divided into to components, or in Django terms,
"apps." One app, web, controls serving all the webpages and rendering
the appropriate templates. The other app, api, only returns JSON data
pertaining to capsules requested, and does not serve any html. The
frontend then connects to these JSON API endpoints using Backbone.js
and Underscore.js to render the views of the capsules that we display
to the user.

Setup
-----
To install and run the code make sure to have python installed on your
machine. Also, make sure you have mysql and elastic search. Now run
`mysql -uroot` and then inside the mysql terminal run `CREATE DATABASE
notatia_local`. This will allow you to later run the site in
development mode.

Then for the python dependencies ideally you should have a virtual
environment set up so that these dependencies do not conflict with any
globally installed python dependencies. Also, make sure to have pip
installed as your python package manager, it makes life easier. Once
all that is set up run `pip install -r requirements.txt` from the
project's root directory. After that finishes, `cd` into the `webapp`
directory and run `./manage.py syncdb`. This should setup the intial
database and prompt you to enter a username and password. It will also
tell you to make sure your database is up to date to run `./manage.py
migrate web` and `./manage.py migrate api`. Then for search to work
you have to run `./manage.py rebuild_index`, this builds the elastic
search indexes.
