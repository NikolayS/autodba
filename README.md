![Build Status](https://github.com/crystaldb/autodba/actions/workflows/build.yml/badge.svg)

# 🤖 AutoDBA for PostgreSQL 🐘

AutoDBA is an AI agent that runs PostgreSQL databases.
This project exists to ensure that everyone who runs PostgreSQL has access to a skilled virtual database administrator (DBA) at all times.

## 💡 Motivation

We all want our production PostgreSQL databases to run well—they should be reliable, performant, efficient, scalable, and secure.
If your team is fully staffed with database administrators, then you are in luck.
If not, you may find yourself working reactively, dealing with problems as they arise and looking up what to do as you go.

Oftentimes, operational responsibility for databases falls to software engineers and site reliability engineers, who usually have many other things to do.
They have better ways to spend their time than tuning or troubleshooting databases.

Reliability and security are the top priorities for database operations, and our approach reflects that.
The success of autonomous vehicles shows that with careful engineering, one can build systems that operate safely in complex environments.
The time has come to do the same for similarly challenging IT operations—as AutoDBA does for databases.


## 🔍 Project Status: Observability Only

As of today, this project includes only the basic observability features of AutoDBA.
Building an AI agent requires quality data, so we first need to make sure that this foundation is solid.

Why did we put effort into tools for visualizing and exploring data when we envision a future were only machines consume it?
For one, we need to verify that the data is sufficient to support good decision making—if a human expert does not have enough information to make a good decision, then we are probably asking too much of the AI agent if we expect it to do so.
Furthermore, AutoDBA's observability tools add value to the PostgreSQL ecosystem, even without an AI agent.

The core AI agent is under development and will be released once it reaches a reasonable degree of accuracy and stability.


## 🚧 Temporary Limitations

This is an early release of AutoDBA's observability features.
We are committed to supporting PostgreSQL in all environments and popular major versions.
However, the following temporary limitations are presently in place:

- Only compatible with PostgreSQL version 14 through 16.
- Only works with Google Cloud SQL and AWS RDS PostgreSQL.


## 🚀 Installation

### Prerequisites

1. *Linux server* with network access to your PostgreSQL database.
We recommend using a machine with at least 2&nbsp;GB of RAM and 10&nbsp;GB of disk space (e.g., `t3.small` on AWS).

2. *Enabling pg_stat_statements*: connect to your database using psql, and run the following SQL commands to enable the pg_stat_statements extension, and make sure it works:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT * FROM pg_stat_statements LIMIT 1;
```

3. *Monitoring DB user*: connect to your database using psql. Then run the following to create a monitoring user. Replace 'YOUR_AUTODBA_PASSWORD' with your desired password for that user:

```sql
CREATE USER autodba WITH PASSWORD 'YOUR_AUTODBA_PASSWORD' CONNECTION LIMIT 5;
GRANT pg_monitor TO autodba;
GRANT USAGE ON SCHEMA public TO autodba;
```

4. AWS or Google Cloud credentials with permissions to read database metrics

### AutoDBA Agent Installation

Follow these instructions to install AutoDBA Agent on Linux.

1. Download the latest release of AutoDBA Agent from the [releases page](https://github.com/crystaldb/autodba/releases).
Choose the version appropriate to your architecture and operating system.
For example:

```bash
wget https://github.com/crystaldb/autodba/releases/latest/download/autodba-0.6.0-rc0-amd64.tar.gz
```

2. Extract the downloaded tar.gz file:
```bash
tar -xzvf autodba-0.6.0-rc0-amd64.tar.gz
cd autodba-0.6.0-rc0
```

3. Run the `install.sh` script to install AutoDBA Agent.

For system-wide installation:

```bash
sudo ./install.sh --system
```

Or for a user-specific installation, specify your preferred install directory:

```bash
./install.sh --install-dir "$HOME/autodba"
```

Or to install in the same extracted directory:
```bash
./install.sh
```

4. Verify the AutoDBA service is running

```bash
systemctl is-active autodba
```

5. Take a look at the AutoDBA service logs:
```
sudo journalctl -xefu autodba.service
```

This command should output `active`.

6. Connect to the AutoDBA web portal on port 4000. If you have installed AutoDBA on a remote server you can use [ssh tunneling](https://www.ssh.com/academy/ssh/tunneling-example) to access it.
For example:
```
ssh -L4000:localhost:4000 <MY_USERNAME>@<MY_HOSTNAME>
```

### AutoDBA Collector Installation

Follow these instructions to install AutoDBA Collector on Linux.

1. Download the latest release of AutoDBA Collector from the [releases page](https://github.com/crystaldb/autodba/releases).
Choose the version appropriate to your architecture and operating system.
For example:

```bash
wget https://github.com/crystaldb/autodba/releases/latest/download/collector-0.6.0-rc0-amd64.tar.gz
```

2. Extract the downloaded tar.gz file:
```bash
tar -xzvf collector-0.6.0-rc0-amd64.tar.gz
cd collector-0.6.0-rc0
```

3. Run this command to create a configuration file (`autodba.conf`) and populate it with values appropriate to your environment:

```conf
cat << EOF > autodba.conf
[autodba]
api_key = DEFAULT-API-KEY
api_base_url = <YOUR_AUTODBA_API_BASE_URL, e.g., http://localhost:7080 or http://autodba-agent:7080 (if you are using run.sh)>

[server1]
db_host = <YOUR_PG_DATABASE_HOST, e.g., xyz.abcdefgh.us-west-2.rds.amazonaws.com>
db_name = <YOUR_PG_DATABASE_NAMES, e.g., postgres>
db_username = <YOUR_PG_DATABASE_USER_NAME, e.g., postgres>
db_password = <YOUR_PG_DATABASE_PASSWORD>
db_port = <YOUR_PG_DATABASE_PASSWORD, e.g., 5432>
aws_db_instance_id = <YOUR_AWS_RDS_INSTANCE_ID, e.g., xyz>
aws_region = <YOUR_AWS_RDS_REGION, e.g., us-west-2>
aws_access_key_id = <YOUR_AWS_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_AWS_SECRET_ACCESS_KEY>

# You can optionally add more servers by adding more sections similar to the above, but with parameters for Google Cloud SQL
# [server2]
# db_host = <YOUR_PG_DATABASE_HOST, e.g., localhost>
# db_name = <YOUR_PG_DATABASE_NAMES, e.g., postgres>
# db_username = <YOUR_PG_DATABASE_USER_NAME, e.g., postgres>
# db_password = <YOUR_PG_DATABASE_PASSWORD>
# db_port = <YOUR_PG_DATABASE_PASSWORD, e.g., 5432>
# gcp_project_id = <YOUR_GCP_PROJECT_ID>
# gcp_cloudsql_instance_id = <YOUR_GCP_CLOUDSQL_INSTANCE_ID>
# gcp_credentials_file = <YOUR_GCP_CREDENTIALS_FILE (default value: ~/.config/gcloud/application_default_credentials.json)>
EOF
```

### Note:
  - `api_base_url` should be the URL for `AutoDBA Agent` installed in the previous section.

  - If you have a PostgreSQL connection string (i.e., URI) of the form `postgres://<db_username>:<db_password>@<db_host>:<db_port>/<db_name>` you can extract `db_username`, `db_password`, `db_host`, `db_port`, and `db_name`.

  - If you're using AWS RDS, then your `<db_host>` is in this format: `<aws_db_instance_id>.<aws_account_id>.<aws_region>.rds.amazonaws.com`

  - For Google Cloud SQL, you need to follow [these instructions](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy) to install gcloud CLI and cloud-sql-proxy (if your database is not directly accessible from this machine). Then, you need to:
    - init `gcloud`: `gcloud init`
    - auth to  `gcloud`: `gcloud auth login`
    - enable default auth on  `gcloud`: `gcloud auth application-default login`
    - Run the proxy: `./cloud-sql-proxy --port <YOUR_PROXIED_DB_PORT> <YOUR_GCP_PROJECT_ID>:<YOUR_GCP_CLOUDSQL_INSTANCE_ID>`.
    - Then, in the configuration file (`autodba.conf`), you should set `db_host = localhost`, and `db_port = <YOUR_PROXIED_DB_PORT>`.

4. Run the `install.sh` script to install AutoDBA Collector.

For system-wide installation:

```bash
sudo ./install.sh --config autodba.conf --system
```

Or for a user-specific installation, specify your preferred install directory:

```bash
./install.sh --config autodba.conf --install-dir "$HOME/autodba-collector"
```

Or to install in the same extracted directory:
```bash
./install.sh --config autodba.conf
```

5. Verify the AutoDBA service is running

```bash
systemctl is-active autodba-collector
```

6. Take a look at the AutoDBA service logs:
```
sudo journalctl -xefu autodba-collector.service
```

This command should output `active`.

## 🗺️ Roadmap

Our near-term roadmap includes the following:

- Observability
    - [x] Database and system metrics
    - [x] Wait events
    - [X] Query normalization + PII filtering
    - [ ] Log analysis
    - [ ] Fleet overview
- Alerting
    - [ ] Accurate (low noise) alerting on current status
    - [ ] Predictive health alerts


## 🤝 Contributing

We welcome contributions to AutoDBA! Contributor guidelines are under development so [please reach out](mailto:johann@crystaldb.cloud) if you are interested in working with us.


## 🧑‍💻 About the Authors

AutoDBA is developed by the engineers and database experts at  [CrystalDB](https://www.crystaldb.cloud/).
Our mission is to make it easy for you to run your database well, so you can focus on building better software.
CrystalDB also offers commercial support for AutoDBA and PostgreSQL.


## 📖 Frequently Asked Questions

### What is AutoDBA?

AutoDBA is an AI agent for operating PostgreSQL databases.
This means that it connects to an existing PostgreSQL database and takes actions, as necessary, to ensure that the database remains reliable, efficient, scalable, and secure.


### Will AutoDBA replace my DBA?

Time will tell whether AI agents completely replace human database administrators (DBAs).
Our work suggests that AI agents will do some tasks much better than humans.
They can find patterns across large amounts of data, they are always available, and they respond instantly.
They can also draw upon extensive knowledge bases and operational datasets, allowing them to proceed with less trial and error than people.

On the other hand, people working in the team will have a more nuanced understanding of the needs of the business.
They will be better able to make high-level design decisions and to analyze trade-offs that impact the development process.


### Do I still need to hire a DBA if I use AutoDBA?

If you do not already have a DBA on staff, then chances are good that AutoDBA can allow you to postpone hiring one, particularly if you have platform engineers or site reliability engineers who are interested in applying its recommendations.
CrystalDB and others also offer commercial support for PostgreSQL.


### Which PostgreSQL versions are supported?

Currently, AutoDBA is only compatible with PostgreSQL version 16.
We are working on expanding support to other versions.
Please share your thoughts on how far back we should go.


### Can I use AutoDBA with my on-premises PostgreSQL installation?

At present, AutoDBA only works with AWS RDS PostgreSQL.
Support for on-premises installations, Google Cloud SQL, and Azure SQL is coming.
We want AutoDBA to run anywhere that PostgreSQL runs.


### Will AutoDBA support databases other than PostgreSQL?

At present, we are fully focused on AutoDBA for PostgreSQL.
We expect to maintain that focus for the forseeable future.


### Is AutoDBA open source?

We believe that every PostgreSQL database should be managed by an AI agent.
In pursuit of this vision, we are releasing the core operational features of AutoDBA under the Apache 2.0 open source license.

For avoidance of doubt, AutoDBA is commercial open source software.
Certain enterprise features will be available only in commercial versions of the product.

As of this writing (August 2024), there is active debate what the term “open source” means for AI models.
Is a model open if the developer releases the weights but not the training data and methods?

We are committed to providing open weights and some training data.
However, we also expect to release models trained on proprietary data sets.


### What happens to the data that AutoDBA collects?

AutoDBA collects and stores operational metrics collected from your database.
It does not transmit this data to anyone.
You should keep the web interface secure to avoid exposing this data to others.


### How can I get support for AutoDBA?

CrystalDB offers commercial support for AutoDBA and PostgreSQL.
For more information or to discuss your needs, please contact us at [support@crystaldb.cloud](mailto:support@crystaldb.cloud).


### How can I support the AutoDBA project?

Foremost, use AutoDBA and give us feedback!

We also welcome feature suggestions, bug reports, or contributions to the codebase.
