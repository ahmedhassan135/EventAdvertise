For this project a minimal version of Centos 7 was used. First the epel release repository was added and packages byobu and nano were installed. Then by using the yum package manager yum update command was entered to update centos. All these steps were done to setup the Centos environment and install some of the necessary tools for further installations and deployment.

Three virtual machines were used in total
-> One Central Database/NFS file system
-> Two Webservers.


For the setup of Database server, MongoDB was used. For installation of mongoDB a repository for MongoDB was added and the latest stable version was used. Once it was done installing "mongod.conf" file in "/etc" was edited and the private ip of the DB Virtual machine was added so that its database may be accessible by the other machines in the local network, i.e. the web servers. After this, the NFS (Network file system) was configured to store files (images) that can be accessed over the local network by the servers. For configuration of NFS the repository epel release was added and nfs-utils was installed. The permission for MongoDB and NFS was also added in the firewall to allow connectivity in the local network.


For the setup of the Web servers, Firstly MongoDB was installed which is the same as the steps followed above for Database server. Then for NFS, the servers are clients so, steps for NFS client was followed. Then the NFS Storage folder was mounted (it can be viewed by entering "df -kh" command). Once all this was done, Node.js was to be installed. The repository for node.js was added and version 12.x was used, i.e. the latest version at the time (12.8.1). Once this was done the project was added to a git repository on github and cloned from the webservers. Then the project was run from the machines, listening on port 80 on their own respective private ip's. The servers are accessed through a load balancer which distributes the traffic evenly to reduce load.
