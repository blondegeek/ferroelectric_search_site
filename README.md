This dataset contains ab intio calculations of ferroelectric candidates found in the Materials Project database. 

The details of how this dataset was created documented in XXX.

To use the scripts in this repository, we recommend importing the distortions.json and workflow_data.json files into a mongo database (mongodb). [Click here for instructions on how to install mongodb on your system.](https://docs.mongodb.com/manual/installation/)

If you are running mongodb locally, start the mongo daemon in a Terminal window.
```bash
mongod
```

To load the json files into your mongo database, run the following in another Terminal window.
```bash
gunzip data_files/distortions.json.gz
gunzip data_files/workflow_data.json.gz
mongoimport --jsonArray --db ferroelectric_dataset --collection distortions --file data_files/distortions.json
mongoimport --jsonArray --db ferroelectric_dataset --collection workflow_data --file data_files/workflow_data.json
```

The scripts in this repository will assume the ferroelectric_dataset is running locally with the default credentials. You may need to change the database credentials.
