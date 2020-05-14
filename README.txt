For this project a minimal version of Centos 7 was used.

Three virtual machines were used in total
-> One Central Database/NFS file system
-> Two Webservers.

For the setup of Database server, MongoDB was used.
For installation of mongoDB a repository for MongoDB was added and the latest stable version was used.
After this, the NFS (Network file system) was configured to store files (images) that can be accessed over the local
network by the servers.


For the setup of the Web servers, Firstly MongoDB was installed which is the same as the steps followed above for Database server.
Then for NFS, the servers are clients so, steps for NFS client was followed.
Then the NFS Storage folder was mounted (it can be viewed by entering "df -kh" command).
Once all this was done, Node.js was to be installed.
Node.js version 12.x was used, i.e. the latest version at the time (12.8.1).
Then the project is run from the machines, listening on port 80 on their own respective private ip's.
The servers are accessed through a load balancer which distributes the traffic evenly to reduce load.
