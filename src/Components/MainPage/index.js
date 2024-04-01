import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import {BsSearch} from 'react-icons/bs'
import axios from "axios";
import "./index.css"
import speakNChatLogo from "../Images/Frame 63.png"
import speakNChatLogoText from "../Images/Frame 64.png";
import { MdPerson } from "react-icons/md";
import { ref, set } from "firebase/database";
import { database } from '../../Firebase'; 
import SpeechRecognition, {
    useSpeechRecognition
  } from "react-speech-recognition";

const MainPage =() =>{
    const userId = localStorage.getItem('userInfo');
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const [userName,setuserName] = useState('')
    const [chatInput, setChatInput] = useState('');
    const [text, setText] = useState("");
    const [genPopUp, setGenPopUp] = useState(false)
    const [userLink, setUserLink] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [showDataInfoPopup,setshowDataInfoPopup] = useState(false);
    const [userDataInfo,setUserDataInfo] = useState(null)
    const [userFormData, setUserFormData] = useState({
        companyName: '',
        payroleName: '',
        to: '',
        from: '',
        experiences: '',
        experiencesRelevant: '',
        currentCTC: '',
        expectedCTC: ''
      });
      const [newCommand, setNewCommand] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const commandss = 
    [
    {
       "command": `Tell me about yourself?`,
       "text": `<p>Myself Prasad, I have total 6.4 years of experience in IT industry, 4.4 years of experience in Splunk Admin and Development, remaining 2 years of experience in middleware technologies, like web logic server, websphere server. Presently I am working in CDK Global. It’s located in Hyderabad.</p> <p>I have good experience in Splunk components like Forwarder, indexer, Search Head and Deployment Server, Cluster Master, License Master, Deployer.</p> <p>I have good experience in configuration files like inputs.conf, outputs.conf, props.conf, transforms.conf, web.conf, and indexes.conf configuration files.</p> <p>I have good experience in data age concept like hot, warm, cold, frozen and thawed buckets.</p> <p>I have good experience Onboarding the data, Decommissioning Servers.</p> <p>I have good experience in onboarding the data different data source. Like agent based, rsyslog feed, HTTP Event Collector, DB connect app, REST API, and SFTP.</p> <p>I have good experience in SPL Commands like stats, Eval, table, dedup, sort, fields commands.</p> <p>I have good experience creating Dashboards, Alerts, and Reports.</p> <p>This is my oral Technical Experience.</p>`
    }, 
    {
       "command": `What are the day to day activities?`,
       "text": `<p>First I need to check all my mails. Then I checked the service now ticketing tool. Based on the incident ticket I started my work. Before that I need to check the application and server health check. Application and server up or not. Then start my work. like Onboarding the data, dashboards, alerts, reports. End of the day I have to submit my work to the team lead.</p>`
    },
    {
       "command": `How many types of on-boarding the data into Splunk?`,
       "text": `<ul><li>Agent Based onboarding</li><li>Rsyslog Feed</li><li>HEC (HTTP Event Collector)</li><li>REST API</li><li>SFTP</li><li>DB Connect</li><li>Script Based</li></ul>`
    },
    {
       "command": `How to Onboarding data into Splunk? Or How to ingest the logs into Splunk?`,
       "text": `<p>We have several ways to onboard the data into Splunk, like agent-based, rsyslog feed, HEC, DB connect. In my project, 80% of onboarding is agent-based.</p><p>My manager is given the excel sheet. In the excel sheet they mention the server IP, server name, source file path, source file name, index name, source type, inputs app name, inputs server class, parsing app name, parsing server class. These details are mentioned in the excel sheet.</p><p>First, I need to connect to the deployment server through CLI in Putty.</p><p>After that, I will navigate to a particular path like:</p><p>cd /opt/splunk/etc/deployment-apps/</p><p>Under deployment apps, I will create an inputs app.</p><p>Within the inputs app, I will create a local folder.</p><p>Within the local folder, I will create an inputs.conf file.</p><p>In the inputs.conf file, I will mention the monitor stanza, like:</p><p>[monitor://source_file_path/source_file_name]</p><p>After that, I will mention the index (index=test). Initially, I need to test in the test index; if everything is fine, then I will move to the production index.</p><p>Then, I will specify the source type as the source type name in the inputs.conf file.</p><p>Based on requirements, I will mention a few parameters in the inputs.conf file like _TCP_ROUTING and disabled=1, ignoreolderthan.</p><p>After that, I will connect to the Deployment Server through GUI.</p><p>Then, I will go to Settings → Forwarder.</p><p>Click on Server Class and then click on the New Server Class button on the right side.</p><p>Then, I will create the server class and add the inputs app. I will also check the restart SplunkD checkbox.</p><p>Next, I need to add the server name in the client white list.</p><p>After that, I need to reload the server class through this command: splunk reload deploy-apps -class [server class name].</p><p>Then, I will go to the search head.</p><p>In the search head, I will check the events and based on event time, I will create the props.conf file.</p><p>In the props.conf file, I need to mention:</p><p>- time zone = US/Eastern</p><p>- time prefix</p><p>- time format</p><p>- should line merge = false</p><p>- line breaker. Here, we need to mention a regex command like 'D' for digit, 'W' for word, 'S' for space.</p><p>- truncate = 999999</p><p>This props code I will push to the heavy forwarder. After that, I need to reload the heavy forwarder server class.</p><p>Then, I will check the events again. If everything is fine, then I will move to the production index. After that, I will reload the inputs server class again.</p><p>This process is followed in my organization.</p>`
    },
    {
       "command": `What is your SPLUNK ARCHITECTURE in your projects?`,
       "text": `<p>My current project's Splunk Architecture is around 50 Indexers, 12 Search Heads, 1 Deployment Server, 1 License Master, 1 Cluster Master, 1 Deployer. We handle a daily license volume of data of 600 GB per day.</p>`
    },
    {
       "command":`What is your architecture means single site or multi site architecture?`,
       "text":`<p>Single Site Architecture</p>`
    },
    {
       "command":`What is Replication Factor and Search Factor?`,
       "text":`<strong>Real Time Explanation:</strong><p>My replication factor is 3 and search factor is 2.</p>`
    },
    {
       "command": `You have 50 indexer, why replication factor is 3?`,
       "text": `<p>Here, 3 is the primary copy because of that replication factor is 3. Here one file is raw data, and the remaining two files contain raw data + TSIDX files. TSIDX files refer to Time series index files.</p><p>Because of that, the Search Factor is 2. The remaining 47 indexers are secondary copies.</p><p>SF is less than or equal to RF.</p>`
    },
    {
       "command":`What is major difference between UF and HF`,
       "text":`<p>UF is having only the forwarding capability. But HF having capabilities of forwarding,Parsing the data , filtering the data and masking the data.</p>`
    },
    {
       "command":`What is the Management port in Splunk?`,
       "text":`<p>8089</p>`
    },
    {
       "command":`What are common port numbers used by Splunk?`,
       "text":`<ul><li>Splunk Web Port: 8000</li><li>Splunk Management Port: 8089</li><li>Splunk Network Port: 514</li><li>Splunk Index Replication Port: 8080</li><li>Splunk Indexing Port: 9997</li><li>KV Store Port: 8191</li></ul>`
    },
    {
       "command":`How to identify which port splunk is running on ?`,
       "text":`<p>Go to /bin and run the following command - ./splunk show web-port to know the management port, run this command - ./splunk show splunkd-port</p>`
    },
    {
       "command":`How do you identify which machine is not reporting to splunk ?`,
       "text":`<p>Login to Deployment server - Check for the deployment client, i.e. Universal Forwarder and check for the phone home interval - if the Phone home interval is longer than usual,ex, 24 hours ago, 3 days ago that means the machine is no longer reporting to Splunk</p>`
    },
    {
       "command":`How you deploy app in SH ?`,
       "text":`<p>Through Deployer</p>`
    },
    {
       "command":`Brute force attack in splunk?`,
       "text":`<p>Check for attempts to gain access to a system by using multiple accounts with multiple passwords.</p>`
    },
    {
       "command":`what kind of data you configured in Splunk?`,
       "text":`<p>it's purly application logs like weblogic server,websphere server,apache tomcat sever,jboss,zabix server logs.</p>`
    },
    {
       "command":`What is Epoch time and how do you convert epoch time into Standard time ?`,
       "text":`<p>Epoch time is UNIX based time in splunk. Epoch time is converted to Standard time using this function - |eval Time = strftime (EpochTimeField,%y-%m-%d %H:%M:%S</p>`
    },
    {
       "command":`How will you troubleshoot Splunk performance issu/error?`,
       "text":`<p>Look through Splunkd.log for diagonostic and error metrices. We can also go to Monitoring console app and check for the resource utilization of different server components like, CPU, MEMORY Utilization etc. We can also install splunk-on-splunk app from splunbase.com and monitor health of different splunk instances</p>`
    },
    {
       "command": `How to optimize the Splunk Query in real time?`,
       "text": `<p>There are several techniques for optimizing Splunk queries in real-time:</p><ul><li>Base searches for dashboards</li><li>Filter as early as possible</li><li>Avoid using wildcards</li><li>Inclusion is always better than exclusion. For example, search specifically for 'status=50*' rather than using '|search NOT status=50*'</li><li>Use summary indexes to speed up search operations</li><li>Use Report Acceleration to speed up report execution time</li><li>Use data models which can be used within a lot of other saved searches like dashboards and reports</li></ul>`
    },
    {
       "command": `Explain how data ages in Splunk?`,
       "text": `<p>In Splunk, data ages through various stages:</p><ul><li>Hot Bucket: Contains newly incoming data. It is searchable and has the highest priority.</li><li>Warm Bucket: Data rolled from the hot bucket comes to this bucket. It is searchable but not actively written into.</li><li>Cold Bucket: Contains data rolled from warm buckets. It is searchable and mainly used for backup purposes. After reaching a threshold, it gets converted to a frozen bucket.</li><li>Frozen Bucket: Once the data is in frozen buckets, it is either archived or deleted. It is not searchable.</li><li>Thawed Bucket: Data can be moved from frozen to thawed bucket for retrieval.</li></ul>`
    },
    {
       "command":`Which bucket is not searchable?`,
       "text":`Frozen and Thawed buckets`
    },
    {
       "command": `How Splunk prevents duplicate indexing of logs/data? What is FishBucket? How does it work?`,
       "text": `<p>Splunk prevents duplicate data by using the fishbucket index. The fishbucket index maintains records of the last ingested data. For example, if the last entry from a particular source was pushed at 4:18 PM CST, the fishbucket index keeps a pointer there, known as the Instruction pointer. The next entry from the same source will be appended after it.</p>`
    },
    {
    "command": `what are most important configuration files in Splunk`,
       "text": `<ul><li>inputs.conf</li><li>output.conf</li><li>transforms.conf</li><li>props.conf</li><li>indexes.conf</li><li>web.conf</li><li>limits.conf</li><li>authentication.conf</li><li>authorization.conf</li><li>collections.conf</li></ul>`
     },
     {
         "command":`How to extracting IP address from logs?`,
         "text":`<p>How to extracting IP address from logs?</p>`
     },
     {
       "command":`What is the Time Zone property in Splunk?`,
       "text":`<p>TZ=US/Eastern we need to mnetion in props.conf file</p>`
     },
     {
       "command": `What are the different types of lookups available in Splunk?`,
       "text": `<ul><li>File Based lookup</li><li>CSV Lookup</li><li>KV Store Lookup</li></ul>`
    },
    {
       "command": `is there any role props.conf file in universal forwarders level?`,
       "text": `Yes, By using event boundaries. Event_Breaks in universal forwarders but line breaking in indexer.`
    },
    {
       "command": `How to filter the unwanted data in Splunk?`,
       "text": `<p>Yes, We can do, we can route the specific unwanted data to NULL QUEUE. Here we can use transform.conf and props.con file. it's do not count the daily license quota.</p><p>props.conf</p><p>[wineventLog:system]</p><p>TRANSFORMS=null_queue_filter</p><p>transforms.conf</p><p>[null_queue_filter]</p><p>REGEX=(?!)^Eventcode=(592|593)</p><p>DEST_KEY=queue</p><p>FORMAT=nullQueue</p>`
    },
    {
       "command": `Index time field extraction and Search time field extraction?`,
       "text": `<p>Index time fields are fields which are indexed at the time of parsing the data in Splunk. They are stored in Memory and hence occupies space. Index time fields can be accessed using Tstats Command.</p><p>Search time fields are created using Eval command in Splunk.</p><p>They do not occupy disk space. These fields which show No results when you try to group them using Tstats command. They can only be invoked using Stats and similar commands.</p>`
    },
    {
       "command": `What is Splunk Workload Management ? Have you worked on this?`,
       "text": `<p>Workflow actions are for automating low level implementation details and getting things automated. We can create workflow actions by going to Settings &gt; Fields &gt; Workflow actions</p>`
    },
    {
         "command":`How to fix the events feature time in Splunk?`,
         "text":`<p>By using DATETIME_CONFIG parameter we can mention in props.conf file like DATETIME_CONFIG = CURRENT</p>`
      },{
         "command":`How to fix the binary files are text in Splunk?`,
         "text":`<p>First find out inputs app and source type name then we can create a props.conf file in inputs app. here we need to mention <br /> [source type name] <br /> NO_BINARY_CHECK=true <br /> then reload the inputs server class.</p>`
      },
      {
       "command": `How you worked on HEC(HTTP Event Collector)?`,
       "text": `<p>Yes, I worked on HTTP Event Collector; it's a token-based HTTP input. First, we need to generate the token.</p><p>Go to Settings → Data Inputs → HTTP Event Collector.</p><p>Then click on 'New Token'. Here, we can mention Name, Source Name Override, Description, then check the 'Enable indexer acknowledgement'. Once the token is generated, we can configure the token backend as well.</p><p>Directly, we can go to the particular path like:</p><p>cd opt/splunk/etc/deployment-apps/splunk_httpinputs/local</p><p>[http://bs_pcf_lab_usw2]</p><p>disabled = 0</p><p>index= index name</p><p>token= here we can mention token name</p><strong>HEC onboarding steps:</strong><ol><li>Create an index in indexes.conf</li><li>Create a token on the GUI of the pre-prod Deployment Server</li><li>We need to write the code in the inputs app:<ol><li>Stanza name</li><li>Index name</li><li>Token</li></ol></li><li>Push to the Heavy Forwarder then restart when possible</li><li>We need to provide the source with URL and Token name and index name, kafka time will set up the token from their end.</li></ol>`
      },
      {
       "command": `What is metadata in Splunk?`,
       "text": `Metadata is data about data. In Splunk, there are 4 default fields: _time, Host, Source, Sourcetype.\n\n_time – The time when the data was ingested into Splunk.\n\nHost – Host is the indexer where the data is stored in the form of Indexes/table.\n\nSource – The file name or machine from where I am getting the data.\n\nSourcetype – The format of file ingested into Splunk. Example, .csv, json, xml, .txt etc.`
      },
      {
       "command": `Explain file precedence in Splunk?`,
       "text": `<ol><li>System local directory — highest priority</li><li>App local directories</li><li>App default directories</li><li>System default directory — lowest priority</li></ol>`
      },
      {
       "command": `what are the knowledge objects?`,
       "text": `<p>tags, event types, field extractions, lookups, reports, alerts, data models, saved searches, transactions, workflow actions, and fields. These are knowledge objects.</p>`
      },
      {
         "command":`What are the troubleshoot the logs not coming to Splunk?`,
         "text":`<p>First we need to check the file log generating or not,if log is generating but not in Splunk then I will start troubleshooting, First i need to check the internal logs means index=_internal host=host name then source=file name then hit enter, events showing clearly means Last time we saw this initcrc, file name was different,You may wish to use larger initCrcLen for this source type or a CRC salt on this source  <p>Then I will increase initCrcLen =1024 to 2048, then i will reload the server class, then I will check data again, if data is coming then fine still data is not coming I will increase initCrcLen=2048 to 4096..I will check like this. Finally I will use CrcSalt=<source></p>`
      },
      {
         "command":`What is tstat command in Splunk?or Difference between stats and tstats command?`,
         "text":`Tstats command works on only index time fields. Like the stats commands it shows up the data in the tabulat format. It is very fast compared to stats command but using tstats you can only group-by with index fields not the search time fields which are created using Eval command.`
      },{
         "command":`What is the REST API?`,
         "text":`REST APIs are path to specific locations or directories for accessing different types of knowledge objects. Example by using, |rest /servicesNS/-/-/saved/searches, you can get list of all reports and alerts. Similary by running, |rest /servicesNS/-/-/data/ui/views, you can get list of all dashboards and so on.`
      },{
         "command":`Have you migrated any knowledge objects from one environment to another environment?`,
         "text":`Yes, you can do them with the help of REST APIs.`
      },{
         "command":`Have you migrated any knowledge objects from one environment to another environment?`,
         "text":`<p>Yes, you can do them with the help of REST APIs</p>`
      },{
         "command":`Where we can find the path of dashboard?`,
         "text":`<p>Use rest /servicesNS/-/-/data/ui/views |search eai.acl_app = * label=Dashboard_title|table eai.acl_app label Or /splunk/etc/apps/xta_app/local/data/ui/views</p>`
      },
      {
         "command":`Alert didn't trigger? Reason? How to troubleshoot?`,
         "text":`<p>Run the following command - |rest /services/search/jobs Alert Name. This will tell you when the alert has last ran. You can also run the following command if you have admin permissions - index=_audit Alert Name - This will tell you what time the alert took to run and when it was last executed. Run, index=_internal to get the diagnostics metrices for the same alert name. You can also run, |rest /servicesNS/-/-/saved/searches |search cron_schedule = 0 * Give the wildcard cron schedule for the alert and check if there are lot of concurret saved searches running at same interval of time. Try changing the schedules of other alerts and reports by 1-2 mins ahead or behind).</p><p>or</p> <ol> <li>Check triggered alerts from Settings > Knowledge > Searches, reports and alerts > Alerts column OR Activity > Triggered alerts</li> <li>Check under python.log for any error/warning message related to savedsearch/alert you want to trigger</li> <li>Also, you may need to check for the skipped searches. Maybe during skipped searches time, you were running into your maxconcurrent limit, which is why this search was skipped multiple times and that is why you did not receive the alert.</li> </ol>  <p><strong>Example of the log is as below:</strong></p> <p>INFO SavedSplunker - savedsearch_id=nobody; SystemManage; SVaccount-authfail-emailsend, user=abcd, app, savedsearch_name, priority=, status=skipped, reason=maxconcurrent limit reached, scheduled_time=1498555860, window_time=0 In case if you see the above info message in logs, you should increase the limit for the maximum number of concurrent searches in limits.conf</p>`
      },{
       "command":`Alerts and reports are stored in where?`,
       "text":`<p>/opt/splunk/ ...../saved/searches.</p>`
      },{
       "command":`Diff bw dashboard and form?`,
       "text":`<p>Dashboard is a view. A form incorporates entire dashboard code by means of a form name. You can refer form name while calling low level APIs for Splunk integration with third-party apps.</p>`
      },{
       "command":`How to optimize the Splunk Query in real time?`,
       "text":`<p>There are lot of techniques - Base searches for dashboards, Filter as early as possible,avoid using wildcards, Inclusion is always better than exclusion. Example, search specifically for status = 50* rather than searching for |search NOT status=50*. </p><p>Use summary indexes to speed up search operations</p><p>Use Report Accelaration to speed up report exceution time. </p><p>Use data models which can be used within lot of other saved searches like dashboards and reports.</p>`
      },{
       "command":`How to add new indexer to cluster?`,
       "text":`<p>Go to Settings > Indexer Clustering > Add peer node - Give master URI. Since it is a new cluster member, you need to run this command so that all data is synced with this cluster as well. The command is - splunk apply cluster-bundle. </p>`
      },{
       "command":`If my indexer is down....How to troubleshoot?`,
       "text":`<p>If one of the indexer cluster members is down, follow a simple process of restarting splunk. After that go to, /opt/splunk and see if you can loop through this directory without any error like, File or directory doesn't exists. If this error persists again and again then check _internal logs in search bar and see what kind of exception has occurred that has caused peer node to go down. Alternatively you can go to /opt/splunk/var/log/splunk/splunkd.log and check for latest 10, 000 entries. Third way would be to go to Monitoring Console app and check for the status of the down peer and see what diagnostic metrices are there. Fourth way would be to go to Settings > Health Card Manager and see what is the status of indexer cluster. if the status for several parameters is in RED that means there is some issue on the server backend as well, it's now time for you to involve server teams as well since it might be a server crash issue as well.</p><p>Normally when a indexer cluster member having searchable copies goes down, the _rawcopies of data gets converted to searchable files (tsidx). Master node in this case takes care of bucket fixing, that is tries to keep the match with the Replication factor you've set up. </p>`
      },{
       "command":`What is maintainance mode?`,
       "text":`<p>Also called as halt mode because it prevents any bucket replication within indexer cluster. Example, in case you are upgrading your splunk from 7.X to 8.X you need to enable maintenance mode. To enable maintenence mode, you need to go to Master node and run command, splunk enable maintenance-mode. After the maintenance activity has occurred you can run, splunk disable maintenance-mode.</p>`
      },{
       "command":`What does maintainance mode do?`,
       "text":`<p>Maintenance mode will halt all buckets fixups, meaning, if there is any corrupt bucket it will not be fixed to normal. Also, maintenance mode will not check for conditions like, Replication factor is not met or Search factor is not met. It also prevents timely rolling of Hot buckets to warm buckets.</p>`
      },{
       "command":`what is search affinity splunk?`,
       "text":`In case of Mutisite cluster, search affinity refers to setting up search heads in a way that they must only query for results from their local site, that is the site that is nearest to them. Example, if you have a multisite cluster in 2 different sites, namely, Rochelle and Hudson. Now if a user searches for any data from Rochelle, all the search requests must go to Indexer clusters which are in Rochelle zone and similar for hudson site as well. Setting up search affinity helps in reducing latency within networks.`
      },{
       "command":`50% of search heads are down? What will happen? How to resolve?`,
       "text":`<p>Run, splunk show shcluster-status to see if the captain is also down. In this case you need to setup a static captain as follows - ./splunk edit shcluster-config -mode captain -captain_uri https://SHURL:8089 -election false. In case you have 4 SH members and 2 went down that means your default replication factor which is set to 3 will not be met. In this case you can reinstantiate a SH cluster with following command as follows by setting the RF to 2. Here is the command, ./splunk init shcluster-config -auth username:password -mgmt_uri https://shheadURI:8089 -replication_port 9000 -replication_factor 2 -conf_deploy_fetch_url http://DeployerURL:8089 -secret deployerencyptedpassword -shcluster_label labelName. </p>`
      },{
       "command":`How to check kv store status?`,
       "text":`<p>We need to run command in bin folder Splunk show kvstore-status</p>`
      },{
       "command":`At a time 10 persons searching for same query but only 6 members getting the query remaining not why?`,
       "text":`<p>Depends on no. of VCPUs that your infrastructure supports. Let's say if you are having 3 Search head members with 2 VCPUs each that means only 2*3 = 6 Concurrent searches can run at a time. You need to increase your throughput by adding more CPUs for concurrent processing.</p>`
      },{
       "command":`If deployment server went down? How to resolve? What is the impact?`,
       "text":`<p>The main purpose why we used DS is to distribute apps and updates to a group of non-clustered Splunk instances. In case DS went down all the Deployment clients polling to DS will not get the latest set of apps and updates.</p>`
      },{
       "command":`Index = abc | delete ….after deleting the data how we can retrieve the data?`,
       "text":`<p>Delete command makes data unavailable from the index. It never reclaims disk space.You can always get the data back from your disk even after you run delete command</p>`
      },{
       "command":`What is the difference between top and head?`,
       "text":`<p>Top gives you list of most common field values along with a percentage of how frequently it is present compared to other field values. Head command just gives initial few results based on the query specified. Example, there is a field called price which has values as, 20, 30, 40, 50, 60, 70, 80, 90, 20, 30, 40, 20. When you run, | top price, this command will give you price value as 20 in first row because 20 is appearing maximum no. of 3 times in all price field values, it will also show percentage of how many times value 20 is appearing. Similarly, if you run - |head 5 price it will give you this as the output - 20, 30, 40, 50, 60.</p>`
      },{
       "command":`What is dispatch directory for?`,
       "text":`<p>Dispatch directory is for running all scheduled saved searches and adhoc searches.</p>`
      },{
       "command":`Explain few transforming commands in SPL?`, 
       "text":`Transforming commands are used for transforming event data into a different format,Stats, chart, timechart, rare, top….`
      },{
       "command":`What is the difference between stats eventstats and streamstats?`,
       "text":`<p>Stats command will give you everything in tabular format. you cannot use stats command evaluation fields in later part of the search.</p> <p>Example, if you do |stats sum(price) as Sum_Price by Product_Name and later you do |table price Product_Name, you will see NULL values for price field. Eventstats is helpful in these cases, Eventstats adds corresponding ouput to each event and you can also re-use the evaluation field in later part of searches as well</p> <p>Example, |eventstats sum(price) as Sum_Price by Product_Name and later you do |table price Product_Name, you will see actual values for price field as well compared to stats command.</p> <p>Streamstats gives running calculation for any field name specified plus it also keeps the orignal value of a field name as same. Example, price field has values as, 20, 30, 40, 50. after you do, |streamstats sum(price) as Sum_Price by Product_Name, you will see that in first row output will be 20, in second it will be 50 (20+30), in third line it will be 90 (50+40) and so on. Later if you do |table price Product_Name, you can also see actual values for price field.</p>`
      },{
       "command":`How to delete the indexed data?`,
       "text":`<p>|delete command to temporarily make the data un-searchable from a search head. There is another command called clear which is run from CLI and removes the entire data from an index.</p>`
      },{
       "command":`What is Lookup. ? How is it useful and used in Splunk?`,
       "text":`<p>Lookup is a knowledge object in Splunk. Within our SPL code if we need to reference to an external file we can do that using lookup. Lookup files can be added to splunk by going to settings > lookups > add lookup files.</p> <p>Lookups are useful also from the perspective of performing several types of joins like, inner, outer etc. </p>`
      },{
       "command":`Change retention period in Indexer? What is the config file?`,
       "text":`<p>Retention period can be changed by editing - Indexes.conf</p>`
      },{
       "command":`fillnull command?`,
       "text":`<p>Replaces null values with a specified value.</p><p>For the current search results, fill all empty fields with NULL. | fillnull value=NULL</p>`
      },{
       "command":`What is Chart command in Splunk?`,
       "text":`<p>Chart command is used to visualise the data in 2-D. Using the chart command we can group by using only 2 fields.</p> <p>Example, index=index name | chart count by Code, price</p>`
      },{
       "command":`What is TimeChart command in Splunk?`,
       "text":`<p>Timechart command is used to visualise the data in 2D. Using the timechart command we can group by only one field.</p><p>Example, index=index name | timechart count by Code </p>`
      },{
       "command":`What are the Boolean operators in Splunk?`,
       "text":`<ul><li>AND</li><li>OR</li><li>NOT</li></ul>`
      },{
       "command":`Static captain and dynamic captain?`,
       "text":`<p>Static captain in a search head cluster is one which doesn't changes. We configure a static captain by logging to servers.conf and changing the parameter - preferred_captain = false. Dynamic captain is one which keeps on changing with passage of time. to set a Dynamic captain we login to servers.conf and change the parameter - preferred_captain = true. </p>`
      },{
       "command":`What is bloom filters?`,
       "text":`<p>Splunk Enterprise uses bloom filters to decrease the time it requires to retrieve events from the index. This strategy is effective when you search for rare terms. Bloom filters work at the index bucket level. </p>`
      },{
       "command":`What kind of data splunk is going to read?`,
       "text":`<p>Structured and unstructured data except binary files</p>`
      },{
       "command":`How do you identify how much data is injected?`,
       "text":`<p>index=_internal idx=* earliest='-1d@d' latest=now() |eval Size = b/(1024/1024/1024)|table Size</p>`
      },
      {
       "command":`which indexer is down? How to identify?`,
       "text":`<p>to identify which Indexer is down we can again run a simple command - index=_internal source=*splunkd.log**Connection failure*- By running this command you will get to know the indexerIP which is having connection failure.</p>`
      },
      {
       "command":`What apps and add-on have you installed and configured in your org?`,
       "text":`<p>- Apps are a full fledged version of splunk enterprise. They contains options for creating dashboards, reports, alerts, lookups, eventypes, tags and all other kind of knowledge objects. Add-ons on other hand perform a limited set of functionalities like for Example, Windows Addon can only get the data from windows based systems, Unix based Add-ons can get data from specfic unix based servers and so on</p><p>We have installed apps like, DBCONNECT and Add ons like, Windows app for infrastructure and Unix apps for getting data from Unix based systems Splunk App for DB connect and Splunk app/addon for linux/unix. </p>`
      },{
       "command":`What is Knowledge bundle in Search head?`,
       "text":`<p>Knowledge bundle is basically a kind of app bundle which is for sending regular updates to all serach head members in a cluster. The captain of the search head cluster distributes knowledge bundle to every search head member whenever any change in 1 or more search head takes place. </p>`
      },{
       "command":`Is there any way to segregate and discard few unwanted data from a single file before reaches the index queue?`,
       "text":`<p>In HF, we have to create the transforms and props files for discard the data</p><ul><li>Transforms.conf</li><li>[discardingdata]</li><li>REGEX=(i?) error</li><li>DEST_KEY=queue</li><li>FORMAT=nullQueue</li><li>Props.conf</li></ul><ul><li>[Sourcetype]</li><li>TRANSFORMS-abc = discardingdata</li></ul></ul>`
      },{
       "command":`Am I able to mask customer sensitive data before it reaches the index queue?`,
       "text":`<p>Yes we can by using Masking rules in props and transforms in HF.</p>`
      },
      {
       "command":`I am in need of transferring five 10 GB files. How much disk space do i need to maintain in my indexer?`,
       "text":`<p>5*10=50GB=Actual data Actual data = 10% raw data + (10 to 110%) of raw data = ¼ of actual data = 5 + 6.5 = round of 12.5 GB space required.</p>`
      },{
       "command":`I am having a log file in which few dataset wants to send to Index A and remaining few to IndexB. Is that possible?`,
       "text":`<p>Yes you can do this. But you need to write Index overriding rules in HF and forward few data to A index and remaining few to B index based on key words</p>`
      },{
       "command":`What is dispatch directory and are we able to take control over it?`,
       "text":`<p>Dispatch directory is nothing but whatever search in search head bar its going to store that records. We have shell scripting based on that script we will clean the dispatch directory.</p>`
      },{
       "command":`How to check search head cluster status?`,
       "text":`<p>./splunk show shcluster-status -auth admin:abc123</p>`
      },{
       "command":`Is it possible to exclude an index from replication?`,
       "text":`<p>Yes, we can exclude.</p><p>Repfactor= auto</p><p>Repfactor=0 (exclude)</p>`
      },{
       "command":`How searches will get processed in Indexer cluster architecture?`,
       "text":`<p>End user run the query in search head, SH contact to master then master guide to SH about which indexer have to go.</p>`
      },{
       "command":`Diff between standalone search head and clustered search head?`,
       "text":`<p>SH:: its wont replicate the splunk knowledge objects</p><p>SHC:: in SHC replicate the splunk knowledge objects</p>`
      },{
        "command":`What will happen if your license is expired on a particular calendar day?`,
        "text":`<p>If license is expired, we cannot able to search and there is no effect on indexing the data in indexer. We will get the 5 alert messages in 30days, after the indexing also not happen.</p>`
      },{
       "command":`How to troubleshoot splunk performance issues?`,
       "text":`<p>We need to check metrics.log file.</p>`
      },{
       "command":`What are alerts in Splunk?`,
       "text":`<p>Alert is nothing but a condition or action. In Splunk, we have three types of alerts: Real-Time alerts, Scheduled alerts, and Rolling-window alerts.</p><p>Recently, I have created the following three alerts:</p><p><strong>1. Windows CPU Usage greater than 95%:</strong></p><p><code>eventtype=perfmon_windows earliest_time=-2m object=Processor counter='% Processor Time' host='*' host!=*AOS* host!=*ARS* host!='vmw-tools-c2w01'| sort -_time, -Value | dedup host | eval value=round(Value)| eval type='CPU' | where value>=95 | table _time, host, type, value</code></p><p><strong>2. Windows Free Memory less than 10%:</strong></p><p><code>eventtype=perfmon_windows object=Memory counter='% Committed Bytes In Use' host='*'|stats max(Value) as Value by host| sort -Value| dedup host | eval Value=round(Value)| rename Value as value| where value >= 90|table host, object, value</code></p><p><strong>3. Windows Disk Free Space less than 10% Check:</strong></p><p><code>index=windows eventtype=hostmon_windows Type=Disk host='*' FileSystem='*' DriveType='*' host!=*AOS* host!=*ARS*| dedup host, Name | eval FreeSpacePct=round(FreeSpaceKB/TotalSpaceKB*100) | eval TotalSpaceGB=round(TotalSpaceKB/1024/1024) | eval FreeSpaceGB=round(FreeSpaceKB/1024/1024) | search FreeSpacePct='*' TotalSpaceGB='*' | dedup host, Name, DriveType, TotalSpaceGB, FreeSpaceGB, FreeSpacePct | search FreeSpacePct <=10 | table host, Name, DriveType, TotalSpaceGB, FreeSpaceGB, FreeSpacePct</code></p>`
      },
      {
       "command":`Tell me`,
       "text":`<p>first</p><p>second</p>`
    },{
       "command":`License Warning ? Queue and pipeline`,
       "text":`<p>in case the daily license limit is exhausted. There will be warnings coming on the searchheads that you've exceeded daily license volume and you either need to upgrade your license or stop ingesting the data. Each and every user authenticated to Splunk has limited search quota - Normal users has around 25 MB whereas power users has around 50-125 MB. Once this threshold is exceeded for a particular time, users searches will start getting queued.</p><ul><li>InputQueue</li><li>ParsingQueue</li><li>MergingQueue</li><li>TypingQueue</li><li>IndexingQueue</li><li>NullQueue</li></ul>`
    },
    {
       "command":`Phonehome interval ? Server class ? Token ?`,
       "text":`<p>Phonehome interval is the time interval for which a particular deployment client will keep polling your Deployment server. Ex, 2 seconds ago, 10 seconds etc.</p> <p>Server class are group of servers coming from the same flavour or same geographic location. Ex, to combine all windows based servers we will create a windows based server class. Similarly, to combine all Unix based servers we will create a unix based server class.</p> <p>Token is a placeholder for a set of values for a particular variable. Example, Name = $Token1$. Now here Name field can have multiple values like, Naveen, Ashu, Ajeet etc.</p> <p>The value that a particular token will hold completely depends upon the selection. Tokens are always enclosed between $$, like the example above.</p>`
    },
    {
       "command": `List the ways for finding if a Forwarder is not reporting to Deployment Server?`,
       "text": `Check if the Forwarder host name/Ip Address is not under the blacklist panel in Deployment server.`
    },
    {
       "command": `List the ways for finding if a Forwarder is not reporting to Deployment Server?`,
       "text": `<p>Check if the Forwarder host name/Ip Address is not under the blacklist panel in Deployment server.</p>`
    },
    {
       "command": `Can SF be 4 ? What data issues you have fixed ?`,
       "text": `<p>If search factor can be 4, then replication factor is equal to 4 or more than 4</P>`
    },
    {
       "command": `What is throttle ? Dashboard ? 2 types of dashboards ?`,
       "text": `<p>Throttling is nothing but suppress results until for a specific time period. this is normally done on each search result basis.</P>\n<p>Dashboard is a kind of view which contains one or more rows, each row contains one or more panels each panel shows up different metrices.</p>\n<p>There are three kinds of dashboards typically created with Splunk:\nDynamic form-based dashboards\nReal-time dashboards\nDashboards as scheduled reports\n</p>`
    },
    {
       "command": `licesne master data has exceeded ? What will happen ?`,
       "text": `If License master data has exceeded you will start seeing warnings on search head, we are not able to searchble but there is no effect on indexing the logs. Like this we will get 5 warnings within 30 days after the indexing also stopped.`
    },
    {
       "command": `What is Data models and Pivot tables?`,
       "text": `<p>Data models are a hierarchal representation of data. It shows the data in a more structured and organised format. Pivot tables are subsets of a data model, it's an interface where users can create reports, alerts without much involvement to SPL language.</p>`
    },
    {
       "command": `Default indexes created during Indexer installation?`,
       "text": `<p>Default indexes are - main, default, summary, _internal, _introspection, _audit, history, _thefishbucket,_telemetry</p>`
    },
    {
       "command": `How to onboard only JSON files ?`,
       "text": `<p>In props.conf we need to use below attribute</p>\n<ul>\n<li>INDEXED_EXTRACTIONS = json</li>\n<li>TRUNCATE = 10000</li>      \n</ul>`
    },
    {
       "command": `How splunk software handle data ?`,
       "text": `<p>It breaks raw data into set of events. Each event is assigned 5 defalut values - host, source, sourcetype, tiemstamp, indexname\n</p>`
    },
    {
       "command": `What is Knowledge bundle in Search head ?`,
       "text": `<p>Knowledge bundle is basically a kind of app bundle which is for sending regular updates to all serach head members in a cluster. The captain of the search head cluster distributes knowledge bundle to every search head member whenever any change in 1 or more search head takes place.</p>`
    },
    {
       "command": `How will you make a indexer not searchable for user (Question wrong)`,
       "text": `<p>I don't know who to do it but I will ask someone</P>`
    },
    {
       "command": `Which config file will you change so that RF & SF to be same in multicluster environment ?`,
       "text": `<p>Indexes.conf</P>`
    },
    {
       "command": `How to pull Yesterday's data from DB, if server was down ?`,
       "text": `<p>If there is a connection problem between database and DBconnect in Splunk and now it has been resolved, we can run a SQL query which contains functions like, sysdate-1 if it's a ORACLE DB or to_date() function again for oracle and other DBMS.\n</p>`
    },
    {
       "command": `What is accelerate reports ?`,
       "text": `<p>Reports acceleration are subjected to Summary indexing. We cannot do report acceleration on data coming directly from application indexes. Report acceleration is done so that a report executes quickly on it's scheduled time. It basically means to minimise the info_max_time.</p>`
    },
    {
       "command": `Push app from deployer to search head in search head cluster`,
       "text": `<p>This will do from deployer\n./splunk apply cluster-bundle</p>`
    },
    {
       "command": `How to initialize the Shcluster by using below command?`,
       "text": `<p>/splunk init shcluster-config -auth admin:password -mgmt_uri <https://IP of SH:8089>-replication_port 9000 -replication_factor 3 -conf_deploy_fetch_url DeployerIpaddress:8089 -secret passwordofdeployer -shcluster_label clusterName</p>`
    },
    {
       "command": `How to delete the indexed data ?`,
       "text": `<p>|delete command to temporarily make the data un-searchable from a search head.\nOr\nFrom on particular indexer\n./splunk clean eventdata -index <indexName></p>`
    },
    {
       "command": `How to create indexes ?`,
       "text": `<p>From the splunk web, we can navigate to Settings > Indexes > New\nOR\n./splunk add index <index_name>\nOR\nVia configuration files -- indexes.conf</p>`
    },
    {
       "command": `How do you read data from third layer of bucket?`,
       "text": `<p>Buckets reside in - $Splunk_Home/var/lib/splunk/defaultdb/db\nBy default Splunk sets the default size to 10 GB for all buckets on a 64-bit OS.\nThird layer of bucket refers to cold bucket which is still searchable.\n</p>`
    },
    {
       "command": `A user is not able to search with particular index. A request to face the issue ? What will you do ?`,
       "text": `<p>we need to go to settings > Access controls > Roles > YourUserRole > Indexes and check if the user has read access to index.\n</p>`
    },
    {
       "command": `Forwarder types ?Uses ?`,
       "text": `<p>2 types of forwarders - Universal Forwarder and Heavy Forwarder.\nUniversal forwarders agents are basically installed on the client, i.e., where we are getting the data. Its consume very less CPU and memory and its don’t have any web.\nHeavy forwarders having full enterprise version of splunk software, it will do parsing (masking, Index routing, sourcetype routing and ignore the garbage date), i.e, pre-processing, routing and filtering capabilities and it have web.</p>`
    },
    {
       "command": `What are alerts ? How moves the data ?`,
       "text": `<p>Alerts are saved searches in Splunk. It is used for if anything goes wrong ( reach search condition) then immediately notify to appropriate team.</p>`
    },
    {
       "command": `How do you reset admin password ?`,
       "text": `<p>Stop Splunk Enterprise\nFind the passw file for your instance ($SPLUNK_HOME/etc/passwd) and rename it to passwd.bkCreate a file named user-seed.conf in your $SPLUNK_HOME/etc/system/local/ directory.\nIn the file add the following text:\n[user_info]\nPASSWORD = NEW_PASSWORD\nIn the place of \`NEW_PASSWORD\` insert the password you would like to use.\nStart Splunk Enterprise and use the new password to log into your instance from Splunk Web.\nIf you previously created other users and know their login details, copy and paste their credentials from the passwbk file into the passwd file and restart Splunk.</p>`
    },
    {
       "command": `Monitor entire health of system ? which component do you login to see the dashboard ?`,
       "text": `<p>monitoring console application - This is a pre-built application</P>`
    },
    {
       "command": `How do you update the indexer when there is a new index to be added ? `,
       "text": `<p>Login to Splunk web, go to setting > indexes >new</p>`
    },
    {
       "command": `Explain about your roles and responsibilities in your organization - ? `,
       "text": `<p><ul><li>- Taking care of scheduled maintenance activities</li>\n<li>- Creating user based knowledge objects like, Dashboards, reports, alerts, static and dynamic lookups, eventtypes, doing field extractions.</li>\n<li>- Troubleshooting issues related to production environment like Dashboard not showing up the data - In this case we basically check from the raw logs if the format of the data has changed or not. </li>\n<li>- Been part of mass password update activities for DATABASE related inputs because if the DATABASE password change happens we need to change the connection password created in our BBConnect application </li></ul></p>`
    },
    {
       "command": `Explain the Architecture of Splunk components in your organization. Single site/Multi site cluster ? `,
       "text": `<p>- We have a multisite cluster both at Rochelle and Hudson. Each of these clusters contains 40 indexers each. Each of the cluster has 1 cluster master, 1 deployment server, more than 10000 forwarders installed on clients, 1 deployment server configured to receive data from forwarders - Deployment server consists of 3 kinds of apps, 7 search heads in a cluster, 1 deployer </p>`
    },
    {
       "command": ` Have you worked on Data Onboarding(very crucial and BAU one) – What kind of data you have on boarded . What process you follow while onboarding a data. Have you also worked on Data normalization. `,
       "text": `<p>Yes. We need to login to the machine basically the client. If the Universal forwarder is already not installed there, we need to install one. Later on we need to go to ./bin and run the following command - </p><p>/splunk add monitor SOURCEFILENAME -index INDEXNAME. Example, we need to monitor a file like this - /var/log/introspection/resource_usage.log. To monitor such file we need to run a command like this, ./splunk add monitor /var/log/introspection/resource_usage.log -index Ashu(Ashu is the name of the index where the data will be stored). </p>`
    },
    {
       "command": `Types of data On-boarded - Application logs, webserver logs.`,
       "text": `<p>Yes, I did worked on Data Normalization. Data normalization as the name states is the process of removing redundant/duplicate data, plus, it also comprises of logically grouping data together. In Splunk we makes use of tags during search time to normalize data. There is one thing we need to take care while normalizing data. Data normalization should only be done at search time and not index time. It is a technique which is adopted for faster data retrieving and lesser search execution time. So, it is better we do it once the data is stored in indexers. </p>\n<p>Pointer: Explain types of data we can ingest in splunk . Common ones they expect us to answer is flat files(logfile, textfile etc) and syslog onboarding. You can also talk about Database and csv onboarding. </P>`
    },
    {
       "command": `What are the important configs on Universal forwarder . Explain them and also explain what all params you define while writing them`,
       "text": `<p>Universal forwarder doesn't have any GUI. So everything that we need to configure is by logging to the UF through admin credentials. Once you login to it using this path opt/splunkforwarder/bin we need to need to run following command to add indexerIP/hostname where it will be forwarding data to. The command is this, ./splunk add forward-server indexerIP:9997 </p>\n<p>Once this is done, we need to add sourcefile names that needs to be added. Example has already been explained in #4, /splunk add monitor /var/log/introspection/resource_usage.log -index Ashu </p>\n<p>Inputs.conf - All the sourcenames added like this, /splunk add monitor /var/log/introspection/resource_usage.log -index Ashu will be visible under inputs.conf</p>\n<p>Outputs.conf - All the indexers name added using this path, /splunk add forward-server indexerIP:9997 will be visible under outputs.conf \nPointers: inputs.conf , outputs.conf </p>`
    },
    {
       "command": `Have you worked on Heavy forwarders ? Whats the importance of it ? what are the important configurations files you have on HF? `,
       "text": `<p>- Heavy forwarders are used for data pre-processing meaning it is used for selective data forwarding and removing unwanted values as well. </p>\n<p>These are the important configs of a Heavy forwarder - \nWhen you open transforms.conf, these are the CONFIG parameters which are configurable - </p>\n<p>DEST_KEY \nREGEX \nFORMAT</p>`
    },
    {
       "command": ` Have you worked on data transformation? For example can achieve below scenarios- `,
       "text": `<p>a. How will you mask the sensitive data before its indexed \nOpen transforms.conf and configure a SEDCMD class - \nSEDCMD-<class> = s/<regex>/<replacement>/flags </p>\n<ul><li>● regex is a Perl language regular expression </li>\n<li>● replacement is a string to replace the regular expression match.</li>\n<li>● flags can be either the letter g to replace all matches or a number to replace a specified match. </li>\n<li>b. Can you change/replace hostname with new host ? </li>\n<li>Using the above class and using the replacement parameter - replacement is a string to replace the regular expression match</li>\n<li>c. How can you filter out unwanted data from a data source and drop it before it gets indexed so that I will save on licensing cost? </li>\n<li>This is done by means of a heavy forwarder using the same configs - \nDEST_KEY \nREGEX \nFORMAT </li></ul>`
    },
    {
       "command": `How have you onboarded syslog data? Can you explain that ?`,
       "text": `<p>Yes, using the unencrypted SYSLOG service and a universal forwarder. Alternatively, we can also use daemon processes like, Collectd and Statsd to transmit data using UDP. </p>`
    },
    {
       "command": `Why is sourcetype and source definition so important ? `,
       "text": `<p>Sourcetype is used as a data classifier whereas source contains the exact path from where the data needs to be onboarded </p>`
    },
    {
       "command": `What is a license master? How does the licensing of the Splunk work ? how to you create a license master and license pool.?`,
       "text": `<p>License master is a splunk instance which is used for monitoring splunk data volume on a daily basis. This is how we configure a license master - \nLogin to any particular indexer - Go to settings > under System > Licensing > Add License File (Mainly an XML based licensing file is added)  </p>`
    },
    {
       "command": ` How much data will be applicable for license cost – Is the entire data size that is being ingested or only the compressed raw data after indexed.`,
       "text": `<p>Licensing cost is calculated on entire data size that is ingested. Compressing has nothing to with License usage, compressing is done to save on Disk space.</p>`
    },
    {
       "command": `What is the data compression ratio – Raw:Index `,
       "text": `<p>Normally data is 38-45% compressed. \nWe can check compressed data by running |dbinspect command. </p>`
    },
    {
       "command": ` Have you worked on Apps and Addons ? What apps and addons have you installed and configured in your org?`,
       "text": `<p>- Apps are a full fledged version of splunk enterprise. They contains options for creating dashboards, reports, alerts, lookups, eventypes, tags and all other kind of knowledge objects. Add-ons on other hand perform a limited set of functionalities like for Example, Windows Addon can only get the data from windows based systems, Unix based Add-ons can get data from specfic unix based servers and so on. </P>\n<p>We have installed apps like, DBCONNECT and Add ons like, Windows app for infrastructure and Unix apps for getting data from Unix based systems </P><p>Pointer: Talk about Splunk App for DB connect and Splunk app/addon for linux/unix . These are 2 common apps/addons that you should know. \nWould be a good deal if you can talk about Splunk app for AWS (cloud integration)</p>`
    },
    {
       "command": ` What is props.conf and transform.conf ? How do you write stanzas and relate them .? `,
       "text": `<p>Props.conf is a configuration file used for selective indexing - mainly used for data pre-processing. We need to mention the sourcename in the props.conf. Transforms.conf is for specifying what all set of events/parameters/fields needs to be excluded. Example, DEST_KEY \nREGEX \nFORMAT</P>`
    },
    {
       "command": `What is Deployment server used for ? what is Serverclass and apps ? how do you deploy base configuration(inputs,outputs.conf) from DS?`,
       "text": `<p>Deployment server is a splunk instance which is used for polling from different deployment clients like, indexer, Universal forwarder, Heavy forwarder etc. \nServer classes is used for grouping different servers based on the classes - like if I have to group all the UNIX based servers i can create a class called - UNIX_BASED_SERVERS and group all servers under this class. Similarly, for Windows based servers I can create a WINDOWS_BASED_SERVERS class and group all servers under this class. \nApps are basically a set of stanzas which are deployed to different members of a server class. </p>\n<p>when we set up server classes and assigns them apps or set of apps we need to restart splunkd, a system level process - Once this is done any new app updates will be automatically sent to all servers.</P>`
    },
    {
       "command": `How will you troubleshoot Splunk performance issu/error? `,
       "text": `<p>Look through Splunkd.log for diagonostic and error metrices. We can also go to Monitoring console app and check for the resource utilization of different server components like, CPU, MEMORY Utilisation etc. \nWe can also install splunk-on-splunk app from splunbase.com and monitor health of different splunk instances </p>`
    },
    {
       "command": `What is Summary index .how do you create accelerated reports ? is Licensing cost applicanble on Summary index? `,
       "text": `<p>Summary index contains summarised or brief data. We create accelerated reports by enabling accelerate reports option. Kindly remember that Report acceleration should only be done on data coming from summary index, not on data coming from the application or main index. \nSummary index doesn't counts on licensing volume.</p>`
    },
    {
       "command": `Name some default Splunk indexes and their use? `,
       "text": `<p>Main - Contains all system related data. \nWhile adding monitor using this command - ./splunk add monitor SOURCEFILENAME if we don't mention any index name the data will automatically go into this index </P>\n<p>_audit - All search related information - Scheduled searches as well as adhoc searches </p>\n<p>_introspection - All system wide data, including memory and CPU data </p>\n<p>_internal - Error specific data. example, DATABASE connectivity hampered, etc. </P>`
    },
    {
       "command": `What is Epoch time and how do you convert epoch time into Standard time ? `,
       "text": `<p>Epoch time is UNIX based time in splunk. Epoch time is converted to Standard time using this function - |eval Time = strftime(EpochTimeField, \`%y-%m-%d %H:%M:%S\`) </p>`
    },
    {
       "command": `What do you know about Splunk CIM ? What is Splunk Data normalization? `,
       "text": `<p>CIM is common information model used by splunk. CIM acts as a common standard used by data coming from different sources. \nData normalization is already explained above </p>`
    },
    {
       "command": `What is the file precedence Splunk follows. Could you explain that? `,
       "text": `<p>System local directory \nThen, App local directories \n( highest preference) </p>\n<p>Then, App default directories \nSystem default directories ( lowest Precedence) </p>`
    },
    {
       "command": `What is dispatch directory for?`,
       "text": `<p>-what ever searches you run on search head, it will store in backend in Dispatch directory, by default it will delet twise of schedule time of scheduled saved searches and adhoc searches are every 10mins </p>`
    },
    {
       "command": `How do you check any config file consistency? ( Explain Btool command) `,
       "text": `<p>Btool command shoudn't be used on most of the cases. It is most unstable command and is very rarely updated. It's mainly for mainframe health check statuses. \nHowever, if we still need to run and debug things we can use this command - ./splunk cmd btool inputs list --debug </P>`
    },
    {
       "command": `How do you configure Search Head cluster ? Explain the Deployer ?`,
       "text": `<p>Search head is a detailed process and requires a lot of pre-requisites to be in place. This is how it is configured - PRE-REQUISITES FOR SEARCH HEAD CLUSTERING ———— \n<ul><li>System Requirements - </li><li>Each member must run on it’s VM </li><li>All members must run the same version of splunk Enterprise </li><li>Members must be connected over a high speed n/w</li><li>There must be at least 3 members deployed to start a SH cluster </li><li>Replication factor must be met for all the scenarios Other system requirements -</li><li>Updates to dashboards, reports, new saved searches created are always subject to Captain - The captain takes care of all of this</li><li>Before we Configure search head clustering, we need to configure a deployer because Deployer IP is required to create a search head cluster A bit about Deployer - </li></ul><h1>DEPLOYER - </h1><p>Distributes apps and other configurations to SH cluster members Can be colocated with deployment server if no. of deployment clients < 50 Can be colocated with Master node Can be colocated with Monitoring console Can service only one SH cluster The cluster uses security keys to communicate/authenticate with SH members</p><h1>Configure a Deployer ———‘</h1><p>Go to - /opt/splunk/etc/system/local and vi servers.conf After this add the below stanza - \n[shclustering] \nPass4symmkey = password \nshcluster_label = cluster1 \nRestart the Splunk since change has been done in .conf files While setting up Search head clustering we first have to create a Deployer as above - When it comes to setting up a SH clustering, the first thing we need to do is login to that particular Search head and run the command by going to bin as follows - ./splunk init shcluster-config -auth admin:password -mgmt_uri IPaddressofSHinHTTPSFollowedByMGMTPort -replication_port 9000 -replication_factor 3 -conf_deploy_fetch_url DeployerIpaddress:8089 -secret passwordofdeployer -shcluster_label clusterName </p>`
    },
    {
       "command": `What are orphaned searches and reports ? How do you find them and change the owner/delete them? `,
       "text": `<p>Scheduled saved searches with invalid owners are considered \`orphaned\`. They cannot be run because Splunk cannot determine the roles to use for the search context. Bu default its enabled, if we want disabled means limits.conf, look for the [system_checks] stanza, and set orphan_searches to disabled.https://docs.splunk.com/Documentation/Splunk/8.0.2/ Knowledge/Resolveorphanedsearches </p>`
    },
    {
       "command": `Explain different Roles and their capabilities in Splunk. `,
       "text": `<p>- User - Can only read from splunk artifacts. Example, Reports, dashboards, alerts and so on. Don't have edit permissions. - Power user - Can create dashboard, alerts, reports and have Edit permissions - Admin- Have access to all production servers, can do server restarts, take care of maintenance activities and so on. Power user and normal user role are subsets of Admin role </p>`
    },
    {
       "command": `What is Lookup. ? How is it useful and used in Splunk?`,
       "text": `<p>Lookup is a knowledge object in Splunk. Within our SPL code if we need to reference to an external file we can do that using lookup. Lookup files can be added to splunk by going to settings > lookups > add lookup files. Lookups are useful also from the perspective of performing several types of joins like, inner, outer etc.</p>`
    },
    {
       "command": `Explain few transform commands in SPL?`,
       "text": `<p>Transforming commands are used for transforming event data into a different format, this may include converting it to Chart, table, etc. Below are some of the examples -</p><ul><li>stats</li><li>chart</li><li>timechart</li><li>rare</li><li>top</li><li>etc</li></ul>`
    },
    {
       "command": `What is tstat command and how does it work? Explain what is tsidx ?`,
       "text": `<p>tstats command to perform statistical queries on indexed fields in tsidx files. TSIDX files are Time series index files. When raw data comes to index it gets converted into Tsidx files. Tsidx files are actually searchable files from Splunk search head</p>`
    },
    {
       "command": `What are the stages of buckets in splunk ? How do you achieve data retention policy in Splunk ?`,
       "text": `<p>Buckets are the directories in Splunk which stores data.</p><p><strong>Different stages are -</strong></p><p>- Hot Bucket: Contains newly incoming data. Once the Hot bucket size reaches a particular threshold, it gets converted to a cold bucket. This bucket is also searchable from the search head.</p><p>- Warm Bucket: Data rolled from the hot bucket comes to this bucket. This bucket is not actively written into but is still searchable. Once the indexer reaches the maximum number of cold buckets maintained by it, it gets rolled to warm buckets.</p><p>- Cold Bucket: Contains data rolled from warm buckets. The data is still searchable from the search head. It's mainly for backup purposes in case one or more hot or warm buckets are unsearchable. After cold buckets reach a threshold, they get converted to frozen buckets.</p><p>- Frozen Bucket: Once the data is in frozen buckets, it is either archived or deleted. In this stage, we are not able to search anything.</p>`
    },
    {
       "command": `How will you configure indexer cluster master ?`,
       "text": `<p>Cluster master or master node is for maintaining a particular cluster. This is how it is configured - </p><p>Enable the master To enable an indexer as the master node:</p><ul><li>Click Settings in the upper right corner of Splunk Web.</li><li>In the Distributed environment group, click Indexer clustering.</li><li>Select Enable indexer clustering.</li><li>Select Master node and click Next.</li></ul><ol><li>Replication Factor: The replication factor determines how many copies of data the cluster maintains. The default is 3. Be sure to choose the right replication factor now, as it is inadvisable to increase it later.</li><li>Search Factor: The search factor determines how many immediately searchable copies of data the cluster maintains. The default is 2. Be sure to choose the right search factor now, as it is inadvisable to increase it later.</li><li>Security Key: This key authenticates communication between the master and the peers/search heads. It must be the same across all cluster nodes.</li><li>Cluster Label: You can label the cluster here for identification in the monitoring console.</li></ol><ul><li>Click Enable master node.</li><li>The message appears, You must restart Splunk for the master node to become active. You can restart Splunk from Server Controls.</li><li>Click Go to Server Controls. This takes you to the Settings page where you can initiate the restart.</li></ul><p>Important: When the master starts up for the first time, it will block indexing on the peers until you enable and restart the full replication factor number of peers. Do not restart the master while it is waiting for the peers to join the cluster. If you do, you will need to restart the peers a second time</p>`
    },
    {
       "command": `What is replication and search factors in CM?`,
       "text": `<p>Search factor nothing but no of copies of indexing files, i.e, it tells about the point out the raw data.</p><p>Replication factor nothing but no of copies of raw data, i.e, compress formate of the actual data. </p>`
    },
    {
       "command": `What is Splunk Workflow ? Have you worked on this.`,
       "text": `<p>Workflow actions are for automating low level implementation details and getting things automated. We can create workflow actions by going to Settings > Fields > Workflow actions</p>`
    },
    {
       "command": `Static captain and dynamic captain`,
       "text": `<p>To switch to a static captain, reconfigure each cluster member to use a static captain:</p><ol><li>On the member that you want to designate as captain, run this CLI command:</li></ol><p>splunk edit shcluster-config -mode captain -captain_uri &lt;URI&gt;:&lt;management_port&gt; -election false</p><ol start=\`2\`><li>On each non-captain member, run this CLI command:</li></ol><p>splunk edit shcluster-config -mode member -captain_uri &lt;URI&gt;:&lt;management_port&gt; -election false</p><p>Note the following:</p><ul><li>The <code>-mode</code> parameter specifies whether the instance should function as a captain or solely as a member. The captain always functions as both captain and a member.</li><li>The <code>-captain_uri</code> parameter specifies the URI and management port of the captain instance.</li><li>The <code>-election</code> parameter indicates the type of captain that this cluster uses. By setting <code>-election</code> to false, you indicate that the cluster uses a static captain.</li></ul><p>You do not need to restart the captain or any other members after running these commands. The captain immediately takes control of the cluster.</p><p>To confirm that the cluster is now operating with a static captain, run this CLI command from any member:</p><p>splunk show shcluster-status -auth &lt;username&gt;:&lt;password&gt;</p><p>The <code>dynamic_election</code> flag will be set to 0.</p><h1>Revert to the dynamic captain</h1><p>When the precipitating situation has resolved, you should revert the cluster to control by a single, dynamic captain. To switch to dynamic captain, you reconfigure all the members that you previously configured for static captain. How exactly you do this depends on the type of scenario you are recovering from. This topic provides reversion procedures for the two main scenarios:</p><ul><li>Single-site cluster with loss of majority, where you converted the remaining members to use static captain. Once the cluster regains a majority, you should convert the members back to dynamic.</li><li>Two-site cluster, where the majority site went down and you converted the members on the minority site to use static captain. Once the majority site returns, you should convert all members to dynamic.</li></ul><p>Return single-site cluster to dynamic captain:</p><h1>As members come back online, convert them one-by-one to point to the static captain:</h1><p>splunk edit shcluster-config -election false -mode member -captain_uri <URI>:<management_port></p><p>As you point each rejoining member to the static captain, it attempts to download the replication delta. If the purge limit has been exceeded, the system will prompt you to perform a manual resync, as explained in How the update proceeds.</p><p>Caution: During the time that it takes for the remaining steps of this procedure to complete, your users should not make any configuration changes.</p><p>Once the cluster has regained its majority, convert all members back to dynamic captain use. Convert the current, static captain last. To accomplish this, run this command on each member:</p><ul><li>The -election parameter indicates the type of captain that this cluster uses. By setting -election to \`true\`, you indicate that the cluster uses a dynamic captain</li><li> The -mgmt_uri parameter specifies the URI and management port for this member instance. You must use the fully qualified domain name. This is the same value that you specified when you first deployed the member with the splunk init command.</li></ul><p>Bootstrap one of the members. This member then becomes the first dynamic captain. It is recommended that you bootstrap the member that was previously serving as the static captain.</p><p>splunk bootstrap shcluster-captain -servers_list <URI>:<management_port>,<URI>:<management_port>,... -auth <username>:<password></p><p>Dynamic captain is one which keeps on changing with passage of time. to set a Dynamic captain we login to servers.conf and change the parameter - preferred_captain = true.</p>`
    },
    {
       "command": `License Warning ? Queue and pipeline`,
       "text": `<p>In case the daily license limit is exhausted, there will be warnings coming on the search heads indicating that you've exceeded the daily license volume. You'll either need to upgrade your license or stop ingesting data. Each user authenticated to Splunk has a limited search quota: normal users typically have around 25 MB, while power users have around 50-125 MB. Once this threshold is exceeded for a particular user, their searches will start getting queued.</p><ul><li>InputQueue</li><li>Parsing Queue</li><li>Merging Queue</li><li>Typing Queue</li><li>Indexing Queue</li><li>Null Queue</li></ul>`
    },
    {
       "command": `Phonehome interval ? Server class ? Token ?`,
       "text": `<p>The phonehome interval is the time interval for which a particular deployment client will keep polling your Deployment server. For example, it could be set to 2 seconds or 10 seconds.</p><p>Server classes are groups of servers sharing similar characteristics, such as being from the same geographic location or having the same operating system. For example, you might create a Windows-based server class or a Unix-based server class.</p><p>A token is a placeholder for a set of values for a particular variable. For example, if you have a variable called \`Name\` and you set its value as \`$Token1$\`, then the value of \`Name\` can be dynamically replaced with different values such as Naveen, Ashu, or Ajeet, depending on the selection. Tokens are enclosed between double dollar signs ($$).</p>`
    },
    {
       "command": `List the ways for finding if a Forwarder is not reporting to Deployment Server?`,
       "text": `<p>To check if a forwarder is not reporting to the Deployment Server, you can verify if the forwarder's hostname or IP address is not listed under the blacklist panel in the Deployment Server.</p>`
    },
    {
       "command": `Can SF be 4 ? What data issues you have fixed ?`,
       "text": `<p>If the search factor (SF) is set to 4, then the replication factor (RF) must also be set to 4 or higher.</p><p>Data issues that I have fixed include resolving data ingestion errors, troubleshooting data parsing issues, fixing data normalization problems, and resolving data indexing failures.</p>`
    },
    {
       "command": `What is throttle ? Dashboard ? 2 types of dashboards ?`,
       "text": `<p>Throttling in Splunk refers to the suppression of search results for a specific time period. This is typically done on a per-search result basis.</p><p>A dashboard in Splunk is a visual representation of data that contains one or more rows, with each row containing one or more panels. Dashboards can display various metrics and insights derived from the data.</p><p>Two types of dashboards in Splunk are:</p><ul><li>Dynamic form-based dashboards</li><li>Real-time dashboards</li></ul>`
    },
    {
       "command": `License master data has exceeded ? What will happen ?`,
       "text": `<p>If the license master data has exceeded, you will start seeing warnings on the search head. While the data might become unsearchable, there will be no effect on indexing the logs. You will receive warnings approximately five times within 30 days after the indexing stops.</p>`
    },
    {
       "command": `What is Data models and Pivot tables?`,
       "text": `<p>Data models are hierarchical representations of data that provide a structured and organized view of the data. Pivot tables are subsets of data models and provide an interface where users can create reports, alerts, and visualizations without needing to use SPL (Search Processing Language) queries directly.</p>`
    },
    {
       "command": `Default indexes created during Indexer installation?`,
       "text": `<p>The default indexes created during the installation of an indexer include: main, default, summary, _internal, _introspection, _audit, history, _thefishbucket, and _telemetry.</p>`
    },
    {
       "command": `How to onboard only JSON files ?`,
       "text": `<p>To onboard only JSON files in Splunk, you can configure the props.conf file with the following attributes:</p><p><code>INDEXED_EXTRACTIONS = json</code></p><p><code>TRUNCATE = 10000</code></p>`
    },
    {
       "command": `How splunk software handle data ?`,
       "text": `<p>Splunk software handles data by breaking it into a set of events. Each event is assigned five default values: host, source, sourcetype, timestamp, and indexname. These values help Splunk organize and process the data effectively.</p>`
    },
    {
       "command": `What is Knowledge bundle in Search head ?`,
       "text": `<p>A knowledge bundle is a type of app bundle used to send regular updates to all search head members in a cluster. The captain of the search head cluster distributes the knowledge bundle to every search head member whenever a change occurs in one or more search heads.</p>`
    },
    {
       "command": `Which config file will you change so that RF & SF to be same in multicluster environment ?`,
       "text": `<p>To ensure that the replication factor (RF) and search factor (SF) are the same in a multi-cluster environment, you would typically modify the <code>indexes.conf</code> configuration file.</p>`
    },
    {
       "command": `How to pull Yesterday's data from DB, if server was down ?`,
       "text": `<p>If there was a connection problem between the database and DBconnect in Splunk, and it has now been resolved, you can pull yesterday's data by running a SQL query that contains functions like <code>sysdate-1</code> (for Oracle databases) or <code>to_date()</code> function for other database management systems.</p>`
    },
    {
       "command": `What is accelerate reports ?`,
       "text": `<p>Accelerated reports are reports that have been subjected to summary indexing. Report acceleration is performed to ensure that a report executes quickly at its scheduled time. It aims to minimize the <code>info_max_time</code> parameter, thereby improving the report's performance.</p>`
    },
    {
       "command": `Push app from deployer to search head in search head cluster`,
       "text": `<p>To push an app from the deployer to the search head in a search head cluster, you would typically run the following command:</p><p><code>./splunk apply cluster-bundle</code></p>`
    },
    {
       "command": `How to initialize the Shcluster by using below command?`,
       "text": `<p>To initialize the Search Head Cluster using the provided command:</p><p><code>./splunk init shcluster-config -auth admin:password -mgmt_uri &lt;https://IP of SH:8089&gt; -replication_port 9000 -replication_factor 3 -conf_deploy_fetch_url DeployerIpAddress:8089 -secret passwordofdeployer -shcluster_label clusterName</code></p>`
    },
    {
       "command": `How to delete the indexed data ?`,
       "text": `<p>To temporarily make indexed data unsearchable from a search head, you can use the <code>|delete</code> command. Alternatively, you can delete indexed data from a particular indexer by running the following command:</p><p><code>./splunk clean eventdata -index &lt;indexName&gt;</code></p>`
    },
    {
       "command": `How to create indexes ?`,
       "text": `<p>To create indexes in Splunk, you can use the Splunk web interface by navigating to <strong>Settings</strong> &gt; <strong>Indexes</strong> &gt; <strong>New</strong>. Alternatively, you can create indexes via the command line using the <code>./splunk add index &lt;index_name&gt;</code> command, or by modifying the <code>indexes.conf</code> configuration file.</p>`
    },
    {
       "command": `How do you read data from third layer of bucket?`,
       "text": `<p>Buckets in Splunk reside in the directory <code>$Splunk_Home/var/lib/splunk/defaultdb/db</code>. By default, Splunk sets the default size to 10 GB for all buckets on a 64-bit operating system. The third layer of bucket typically refers to cold buckets, which are still searchable.</p>`
    },
    {
       "command": `A user is not able to search with particular index. A request to face the issue ? What will you do ?`,
       "text": `<p>If a user is unable to search with a particular index, you should navigate to <strong>Settings</strong> &gt; <strong>Access controls</strong> &gt; <strong>Roles</strong> &gt; <em>YourUserRole</em> &gt; <strong>Indexes</strong> and verify if the user has read access to the index in question. If not, you should grant the necessary permissions to the user.</p>`
    },
    {
       "command": `Forwarder types ?Uses ?`,
       "text": `<p>There are two types of forwarders in Splunk: Universal Forwarder and Heavy Forwarder.</p><p>The Universal Forwarder is installed on client machines to collect and forward data to the Splunk indexer. It consumes minimal CPU and memory resources and does not have a web interface.</p><p>The Heavy Forwarder is a full version of the Splunk software with additional features for parsing, routing, and filtering data before forwarding it to the indexer. It is capable of pre-processing data and has a web interface for configuration and management.</p>`
    },
    {
       "command": `What are alerts ? How moves the data ?`,
       "text": `<p>In Splunk, alerts are saved searches that are used to notify users or trigger actions when specific conditions are met. Alerts can be configured to monitor data continuously and take action when certain criteria are fulfilled.</p>`
    },
    {
       "command": `Explain about your roles and responsibilities in your organization -`,
       "text": `<p>My roles and responsibilities in the organization include:</p><ul><li>Taking care of scheduled maintenance activities.</li><li>Creating user-based knowledge objects such as dashboards, reports, alerts, static and dynamic lookups, and event types.</li><li>Troubleshooting issues related to the production environment, such as investigating why dashboards may not be displaying data.</li><li>Participating in mass password update activities for database-related inputs in the event of database password changes.</li></ul>`
    },
    {
       "command": `Explain the Architecture of Splunk components in your organization. Single site/Multi site cluster ?`,
       "text": `<p>In our organization, we have a multi-site cluster architecture deployed across Rochelle and Hudson. Each cluster consists of 40 indexers, a cluster master, a deployment server, and more than 10,000 forwarders installed on client machines. Additionally, each cluster has a deployment server configured to receive data from the forwarders. The deployment server contains various types of apps, and there are seven search heads in each cluster, along with a deployer.</p>`
    },
    {
       "command": `Questions on Ports will be asked . Can you change the default port on which splunk component runs and if yes how. ?`,
       "text": `<p>Yes, the default port on which Splunk components run can be changed. To do this:</p><ul><li>Log into Splunk Web as the admin user.</li><li>Click <strong>Settings</strong> in the top-right of the interface.</li><li>Click the <strong>Server settings</strong> link in the System section of the screen.</li><li>Click <strong>General settings</strong>.</li><li>Change the value for either the Management port or Web port, and click <strong>Save</strong>.</li><li>Alternatively, you can also go to the <code>/bin</code> folder and run the following command: <code>splunk set web-port newportnumber</code></li></ul>`
    },
    {
       "command": `Have you worked on Data Onboarding(very crucial and BAU one) – What kind of data you have on boarded . What process you follow while onboarding a data. Have you also worked on Data normalization.`,
       "text": `<p>Yes, I have worked on data onboarding, which is a crucial and routine activity. I typically onboard various types of data, including application logs and web server logs. The process involves installing a Universal Forwarder on the client machine and then configuring it to monitor specific log files. For example, I might run a command like <code>./splunk add monitor /var/log/introspection/resource_usage.log -index Ashu</code> to monitor a file and send its data to a specific index named 'Ashu'.</p><p>I have also worked on data normalization, which involves removing redundant or duplicate data and logically grouping related data together. In Splunk, we use tags during search time to normalize data, ensuring that it's organized and retrievable efficiently. Data normalization should only be done at search time and not during indexing to optimize search performance.</p>`
    },
    {
       "command": `What are the important configs on Universal forwarder . Explain them and also explain what all params you define while writing them`,
       "text": `<p>Universal forwarder doesn't have any GUI. So everything that we need to configure is by logging to the UF through admin credentials. Once you login to it using this path opt/splunkforwarder/bin we need to need to run following command to add indexerIP/hostname where it will be forwarding data to. The command is this, ./splunk add forward-server indexerIP:9997</p><p>Once this is done, we need to add sourcefile names that needs to be added. Example has already been explained in #4, /splunk add monitor /var/log/introspection/resource_usage.log -index Ashu</p><p>Inputs.conf - All the sourcenames added like this, /splunk add monitor /var/log/introspection/resource_usage.log -index Ashu will be visible under inputs.conf</p><p>Outputs.conf - All the indexers name added using this path, /splunk add forward-server indexerIP:9997 will be visible under outputs.conf</p><p>Pointers: inputs.conf , outputs.conf</p>`
    },
    {
       "command": `Have you worked on Heavy forwarders ? Whats the importance of it ? what are the important configurations files you have on HF?`,
       "text": `<p>- Heavy forwarders are used for data pre-processing meaning it is used for selective data forwarding and removing unwanted values as well.</p><p>These are the important configs of a Heavy forwarder -</p><p>When you open transforms.conf, these are the CONFIG parameters which are configurable -</p><ul><li>DEST_KEY</li><li>REGEX</li><li>FORMAT</li></ul>`
    },
    {
       "command": `Have you worked on data transformation? For example can achieve below scenarios`,
       "text": `<p>a. How will you mask the sensitive data before its indexed Open transforms.conf and configure a SEDCMD class -</p><p>SEDCMD-<class> = s/<regex>/<replacement>/flags</p><ul><li>regex is a Perl language regular expression</li><li>replacement is a string to replace the regular expression match</li><li>flags can be either the letter g to replace all matches or a number to replace a specified match.</li></ul><p>b. Can you change/replace hostname with new host ?</p><p>Using the above class and using the replacement parameter - replacement is a string to replace the regular expression match</p><p>c. How can you filter out unwanted data from a data source and drop it before it gets indexed so that I will save on licensing cost ?</p><p>This is done by means of a heavy forwarder using the same configs -</p><ul><li>DEST_KEY</li><li>REGEX</li><li>FORMAT</li></ul>`
    },
    {
       "command": `How have you onboarded syslog data? Can you explain that ?`,
       "text": `<p>Yes, using the unencrypted SYSLOG service and a universal forwarder. Alternatively, we can also use daemon processes like, Collectd and Statsd to transmit data using UDP.</p>`
    },
    {
       "command": `Why is sourcetype and source definition so important ?`,
       "text": `<p>Sourcetype is used as a data classifier whereas source contains the exact path from where the data needs to be onboarded</p>`
    },
    {
       "command": `What is a license master? How does the licensing of the Splunk work ? how to you create a license master and license pool.?`,
       "text": `<p>License master is a splunk instance which is used for monitoring splunk data volume on a daily basis. This is how we configure a license master -</p><p>Login to any particular indexer - Go to settings &gt; under System &gt; Licensing &gt; Add License File (Mainly an XML based licensing file is added)</p>`
    },
    {
       "command": `How much data will be applicable for license cost – Is the entire data size that is being ingested or only the compressed raw data after indexed.`,
       "text": `<p>Licensing cost is calculated on entire data size that is ingested. Compressing has nothing to with License usage, compressing is done to save on Disk space.</p>`
    },
    {
       "command": `What is the data compression ratio – Raw:Index`,
       "text": `<p>Normally data is 38-45% compressed.</p><p>We can check compressed data by running |dbinspect command.</p>`
    },
    {
       "command": `Have you worked on Apps and Addons ? What apps and addons have you installed and configured in your org?`,
       "text": `<p>- Apps are a full fledged version of splunk enterprise. They contains options for creating dashboards, reports, alerts, lookups, eventypes, tags and all other kind of knowledge objects. Add-ons on other hand perform a limited set of functionalities like for Example, Windows Addon can only get the data from windows based systems, Unix based Add-ons can get data from specfic unix based servers and so on.</p><p>We have installed apps like, DBCONNECT and Add ons like, Windows app for infrastructure and Unix apps for getting data from Unix based systems</p><p>Pointer: Talk about Splunk App for DB connect and Splunk app/addon for linux/unix . These are 2 common apps/addons that you should know.</p><p>Would be a good deal if you can talk about Splunk app for AWS (cloud integration)</p>`
    },
    {
       "command": `What is props.conf and transform.conf ? How do you write stanzas and relate them .?`,
       "text": `<p>Props.conf is a configuration file used for selective indexing - mainly used for data pre-processing. We need to mention the sourcename in the props.conf. Transforms.conf is for specifying what all set of events/parameters/fields needs to be excluded. Example,</p><ul><li>DEST_KEY</li><li>REGEX</li><li>FORMAT</li></ul>`
    },
    {
       "command": `Questions on regex will be asked – A common one would be – could you tell me the regex for IP address.?`,
       "text": `<p>Regex in splunk are done with the help of rex, regex and erex command. No one will ever ask you to tell regex about IPaddresses</p>`
    },
    {
       "command": `What is Deployment server used for ? what is Serverclass and apps ? how do you deploy base configuration(inputs,outputs.conf) from DS?`,
       "text": `<p>Deployment server is a splunk instance which is used for polling from different deployment clients like, indexer, Universal forwarder, Heavy forwarder etc.</p><p>Server classes is used for grouping different servers based on the classes - like if I have to group all the UNIX based servers i can create a class called - UNIX_BASED_SERVERS and group all servers under this class. Similarly, for Windows based servers I can create a WINDOWS_BASED_SERVERS class and group all servers under this class.</p><p>Apps are basically a set of stanzas which are deployed to different members of a server class.</p><p>when we set up server classes and assigns them apps or set of apps we need to restart splunkd, a system level process - Once this is done any new app updates will be automatically sent to all servers.</p>`
    },
    {
       "command": `How will you troubleshoot Splunk performance issue/error?`,
       "text": `<p>Look through Splunkd.log for diagonostic and error metrices. We can also go to Monitoring console app and check for the resource utilization of different server components like, CPU, MEMORY Utilisation etc.</p><p>We can also install splunk-on-splunk app from splunbase.com and monitor health of different splunk instances</p>`
    },
    {
       "command": `What is Summary index .how do you create accelerated reports ? is Licensing cost applicanble on Summary index?`,
       "text": `<p>Summary index contains summarised or brief data. We create accelerated reports by enabling accelerate reports option. Kindly remember that Report acceleration should only be done on data coming from summary index, not on data coming from the application or main index.</p><p>Summary index doesn't counts on licensing volume.</p>`
    },
    {
       "command": `Name some default Splunk indexes and their use?`,
       "text": `<p>Main - Contains all system related data. While adding monitor using this command - ./splunk add monitor SOURCEFILENAME if we don't mention any index name the data will automatically go into this index</p><p>_audit - All search related information - Scheduled searches as well as adhoc searches</p><p>_introspection - All system wide data, including memory and CPU data</p><p>_internal - Error specific data. example, DATABASE connectivity hampered, etc.</p>`
    },
    {
       "command": `What is Epoch time and how do you convert epoch time into Standard time ? (function in splunk)`,
       "text": `<p>Epoch time is UNIX based time in splunk. Epoch time is converted to Standard time using this function - |eval Time = strftime(EpochTimeField, \`%y-%m-%d %H:%M:%S\`)</p>`
    },
    {
       "command": `What do you know about Splunk CIM ? What is Splunk Data normalization?`,
       "text": `<p>CIM is common information model used by splunk. CIM acts as a common standard used by data coming from different sources.</p><p>Data normalization is already explained above</p>`
    },
    {
       "command": `What is the file precedence Splunk follows. Could you explain that ?`,
       "text": `<ul><li>- System local directory has the highest preference</li><li>- Then, App local directories</li><li>- Then, App default directories</li><li>- And at last, System default directories</li></ul>`
    },
    {
       "command": `How Splunk prevents duplicate indexing of logs/data ? what is FishBucket ? how does it work ?`,
       "text": `<p>Splunk prevents duplicate data by means of fishbucket index. Fishbucket index mainly consist of record of last ingested data. So, let us say if the last entry from a particular source was pushed at 4:18 PM CST, it will keep a pointer there, we call it as the Instruction pointer. Now next entry from the similar source will be appended after it.</p>`
    },
    {
       "command": `What is dispatch directory for ?`,
       "text": `<p>- Dispatch directory is for running all scheduled saved searches and adhoc searches.</p>`
    },
    {
       "command": `How do you check any config file consistency? ( Explain Btool command)`,
       "text": `<p>Btool command shoudn't be used on most of the cases. It is most unstable command and is very rarely updated. It's mainly for mainframe health check statuses.</p><p>However, if we still need to run and debug things we can use this command -</p><p>./splunk btool inputs list --debug</p>`
    },
    {
       "command": `How do you configure Search Head cluster ? Explain the Deployer ?`,
       "text": `<p>Search head is a detailed process and requires a lot of pre-requisites to be in place.</p>\n<p>This is how it is configured -</p>\n<p>PRE-REQUISITES FOR SEARCH HEAD CLUSTERING ————</p>\n<ul><li>System Requirements -</li><li>Each member must run on it’s VM</li><li>All machines must run the same OS (Need to clarify whether version difference is also important)</li><li>All members must run the same version of splunk Enterprise</li><li>Members must be connected over a high speed n/w</li><li>There must be at least 3 members deployed to start a SH cluster</li><li>Replication Factor ———</li></ul>\n<p>Replication factor must be met for all the scenarios</p>\n<p>Other system requirements -</p>\n<ul><li>Updates to dashboards, reports, new saved searches created are always subject to Captain - The captain takes care of all of this</li><li>Before we Configure search head clustering, we need to configure a deployer because Deployer IP is required to create a search head cluster</li></ul>\n<p>A bit about Deployer -</p>\n<p>DEPLOYER -</p>\n<p>Distributes apps and other configurations to SH cluster members\nCan be colocated with deployment server if no. of deployment clients < 50\nCan be colocated with Master node\nCan be colocated with Monitoring console\nCan service only one SH cluster\nThe cluster uses security keys to communicate/authenticate with SH members</p>\n<p>Configure a Deployer ———‘</p>\n<p>Go to - /opt/splunk/etc/system/local and vi servers.conf</p>\n<p>After this add the below stanza -</p>\n<p>[shclustering]\nPass4symmkey = password\nshcluster_label = cluster1</p>\n<p>Restart the Splunk since change has been done in .conf files</p>\n<p>While setting up Search head clustering we first have to create a Deployer as above -</p>\n<p>When it comes to setting up a SH clustering, the first thing we need to do is login to that particular Search head and run the command by going to bin as follows -</p>\n<p>./splunk init shcluster-config -auth admin:password -mgmt_uri IPaddressofSHinHTTPSFollowedByMGMTPort -replication_port 9000 -replication_factor 3 -conf_deploy_fetch_url DeployerIpaddress:8089 -secret passwordofdeployer -shcluster_label clusterName</p>`
    },
    {
       "command": `What are orphaned searches and reports ? How do you find them and change the owner/delete them?`,
       "text": `<p>Scheduled saved searches which are under different user names who are no more part of the splunk ecosystem or have left the company are called as orphaned searches. It happens because there is no role associated within splunk for that particluar user.</p>\n<p>With recent upgrade of Splunk to 8.0.1 the problem with orphaned searches has almost resolved. But still if you see the orphaned searches warning appearing under Messages in your search head you can follow this guideline on how to resolve.</p>\n<a>https://docs.splunk.com/Documentation/Splunk/8.0.2/Knowledge/Resolveorphanedsearches</a>`
    },
    {
       "command": `Explain different Roles and their capabilities in Splunk.`,
       "text": `<p>- User - Can only read from splunk artifacts. Example, Reports, dashboards, alerts and so on. Don't have edit permissions.</p>\n<p>- Power user - Can create dashboard, alerts, reports and have Edit permissions</p>\n<p>- Admin- Have access to all production servers, can do server restarts, take care of maintenance activities and so on. Power user and normal user role are subsets of Admin role</p>`
    },
    {
       "command": `What is Lookup. ? How is it useful and used in Splunk?`,
       "text": `<p>Lookup is a knowledge object in Splunk. Within our SPL code if we need to reference to an external file we can do that using lookup. Lookup files can be added to splunk by going to settings > lookups > add lookup files.</p>\n<p>Lookups are useful also from the perspective of performing several types of joins like, inner, outer etc.</p>`
    },
    {
       "command": `Explain few transform commands in SPL?`,
       "text": `<p>Transforming commands are used for transforming event data into a different format, this may include converting it to Chart, table, etc.</p>\n<p>Below are some of the examples -</p>\n<ul><li>stats</li><li>chart</li><li>timechart</li><li>rare</li><li>top etc</li></ul>`
    },
    {
       "command": `What is tstat command and how does it work? Explain what is tsidx ?`,
       "text": `<p>Tstats command works on only index time fields. Like the stats commands it shows up the data in the tabulat format. It is very fast compared to stats command but using tstats you can only group-by with index fields not the search time fields which are created using Eval command.</p>\n<p>TSIDX files are Time series index files. When raw data comes to index it gets converted into Tsidx files. Tsidx files are actually searchable files from Splunk search head</p>`
    },
    {
       "command": `What are the stages of buckets in splunk ? How do you achieve data retention policy in Splunk ?`,
       "text": `<p>Buckets are the directories in Splunk which stores data.</p>\n<p>Different stages are -</p>\n<p>- Hot Bucket - Contains newly incoming data. One the Hot bucket size reaches a particular threshold, it gets converted to a cold bucket. This bucket is also searchable from the search head</p>\n<p>- Warm bucket - Data rolled from hot bucket comes to this bucket. This bucket is not actively written into but is still searchable. Once the indexer reaches maximum number of cold buckets maintained by it, it gets rolled to warm buckets</p>\n<p>- Cold - Contains data rolled from warm buckets. The data is still searcahble from the search head. It's mainly for the backup purpose in case one or more hot or warm buckets are unsearchable. After cold buckets reaches a threshold, they gets converted to Frozen buckets</p>\n<p>- Frozen - Once the data is in Frozen buckets, it is either archived or deleted.</p>`
    },
    {
       "command": `How will you configure indexer cluster master ?`,
       "text": `<p>Cluster master or master node is for maintaining a particular cluster. This is how it is configured -</p>\n<p>Enable the master\nTo enable an indexer as the master node:\n1. Click Settings in the upper right corner of Splunk Web.\n2. In the Distributed environment group, click Indexer clustering.\n3. Select Enable indexer clustering.\n4. Select Master node and click Next.\n5. There are a few fields to fill out:</p>\n<ul><li>Replication Factor.The replication factor determines how many copies of data the cluster maintains. The default is 3. For more information on the replication factor, see Replication factor. Be sure to choose the right replication factor now. It is inadvisable to increase the replication factor later, after the cluster contains significant amounts of data.</li><li>Search Factor. The search factor determines how many immediately searchable copies of data the cluster maintains. The default is 2. For more information on the search factor, see Search factor. Be sure to choose the right search factor now. It is inadvisable to increase the search factor later, once the cluster has significant amounts of data.</li><li>Security Key. This is the key that authenticates communication between the master and the peers and search heads. The key must be the same across all cluster nodes. The value that you set here must be the same that you subsequently set on the peers and search heads as well.</li><li>Cluster Label. You can label the cluster here. The label is useful for identifying the cluster in the monitoring console. See Set cluster labels in Monitoring Splunk Enterprise.</li></ul>\n<p>6. Click Enable master node.</p>\n<p>The message appears, 'You must restart Splunk for the master node to become active. You can restart Splunk from Server Controls.'</p>\n<p>7. Click Go to Server Controls. This takes you to the Settings page where you can initiate the restart.</p>\n<p>Important: When the master starts up for the first time, it will block indexing on the peers until you enable and restart the full replication factor number of peers. Do not restart the master while it is waiting for the peers to join the cluster. If you do, you will need to restart the peers a second time.</p>`
    },
    {
       "command": `What is replication and search factors in CM?`,
       "text": `<p>Search factor tells the no. of searchable copies available</p>\n<p>Replication factor tells how many indexers have the search copies available</p>`
    },
    {
       "command": `Phonehome interval ? Server class ? Token ?`,
       "text": `<p>Phonehome interval is the time interval for which a particular deployment client will keep polling your Deployment server. Ex, 2 seconds ago, 10 seconds etc.</p>\n<p>Server class are group of servers coming from the same flavour or same geographic location. Ex, to combine all windows based servers we will create a windows based server class. Similarly, to combine all Unix based servers we will create a unix based server class.</p>\n<p>Token is a placeholder for a set of values for a particular variable. Example, Name = $Token1$. Now here Name field can have multiple values like, Naveen, Ashu, Ajeet etc. The value that a particular token will hold completely depends upon the selection. Tokens are always enclosed between $$, like the example above.</p>`
    },
    {
       "command": `List the ways for finding if a Forwarder is not reporting to Deployment Server?`,
       "text": `<p>Check if the Forwarder host name/Ip Address is not under the blacklist panel in Deployment server.</p>`
    },
    {
       "command": `Can SF be 4 ? What data issues you have fixed ?`,
       "text": `<p>Yes search factor can be 4 if replication factor is at least 5</p>`
    },
    {
       "command": `What is throttle ? Dashboard ? 2 types of dashboards?`,
       "text": `<p>Throttling is suppressing an alert for a specific interval of time. this is normally done on each search result basis.</p>\n<p>Dashboard is a kind of view which contains different panels and panel shows up different metrices.</p>\n<p>2 types of dashboards - I didn't understood this question</p>`
    },
    {
       "command": `licesne master data has exceeded ? What will happen?`,
       "text": `<p>If License master data has exceeded you will start seeing warnings on search head, Data ingestion will be stopped but a user will still be able to search the data.</p>`
    },
    {
       "command": `What is Data models and Pivot tables?`,
       "text": `<p>Data models are a hierarchal representation of data. It shows the data in a more structured and organised format. Pivot tables are subsets of a data model, it's an interface where users can create reports, alerts without much involvement to SPL language.</p>`
    },
    {
       "command": `Default indexes created during Indexer installation?`,
       "text": `<p>Default indexes are - main, default, summary, _internal, _introspection, _audit</p>`
    },
    {
       "command": `. How to onboard only JSON files ?`,
       "text": `<p>Set the sourcetype as JSON</p>`
    },
    {
       "command": `How splunk software handle data ?`,
       "text": `<p>It breaks raw data into set of events. Each event is assigned 5 defalut values - host, source, sourcetype, tiemstamp, indexname</p>`
    },
    {
       "command": `What is Knowledge bundle in Search head ?`,
       "text": `<p>Knowledge bundle is basically a kind of app bundle which is for sending regular updates to all serach head members in a cluster. The captain of the search head cluster distributes knowledge bundle to every search head member whenever any change in 1 or more search head takes place.</p>`
    },
    {
       "command": `How will you make a indexer not searchable for user`,
       "text": `<p>I don't know who to do it but I will ask someone</p>`
    },
    {
       "command": `Which config file will you change so that RF & SF to be same in multicluster environment ?`,
       "text": `<p>Indexes.conf</p>`
    },
    {
       "command": `How to pull Yesterday's data from DB, if server was down ?`,
       "text": `<p>If there is a connection problem between database and DBconnect in Splunk and now it has been resolved, we can run a SQL query which contains functions like, sysdate-1 if it's a ORACLE DB or to_date() function again for oracle and other DBMS.</p>`
    },
    {
       "command": `What is accelerate reports ?`,
       "text": `<p>Reports acceleration are subjected to Summary indexing. We cannot do report acceleration on data coming directly from application indexes. Report acceleration is done so that a report executes quickly on it's scheduled time. It basically means to minimise the info_max_time.</p>`
    },
    {
       "command": `Push app from deployer to search head in search head cluster`,
       "text": `<p>This is the done with this command and already explained above - ./splunk init shcluster-config -auth admin:password -mgmt_uri IPaddressofSHinHTTPSFollowedByMGMTPort -replication_port 9000 -replication_factor 3 -conf_deploy_fetch_url DeployerIpaddress:8089 -secret passwordofdeployer -shcluster_label clusterName</p>`
    },
    {
       "command": `How to delete the indexed data ?`,
       "text": `<p>|delete command to temporarily make the data un-searchable from a search head. There is another command called clear which is run from CLI and removes the entire data from an index.</p>`
    },
    {
       "command": `How to create indexes ?`,
       "text": `<p>From the splunk web, we can navigate to Settings > Indexes > New</p>`
    },
    {
       "command": `How do you read data from third layer of bucket?`,
       "text": `<p>Buckets reside in - $Splunk_Home/var/lib/splunk/defaultdb/db</p>\n<p>By default Splunk sets the default size to 10 GB for all buckets on a 64-bit OS. Third layer of bucket refers to cold bucket which is still searchable.</p>`
    },
    {
       "command": `A user is not able to search with particular index. A request to face the issue ? What will you do ?`,
       "text": `<p>we need to go to settings > Access controls > Roles > YourUserRole > Indexes and check if the user has read access to index.</p>`
    },
    {
       "command": `Forwarder types ?Uses ?`,
       "text": `<p>2 types of forwarders - Universal Forwarder and Heavy Forwarder.</P>\n<p>Universal forwarders are basically agents which are installed on the client, i.e., servers from where we are getting the data. They don't have any pre-processing capability. Heavy forwarders in turn have pre-processing, routing and filtering capabilities.</p>`
    },
    {
       "command": `What are alerts ? How moves the data ?`,
       "text": `<p>Alerts are saved searches in Splunk. They are used for notifying application/server owners etc about the erroneous conditions that may occur</p>`
    },
    {
       "command": `How do you identify how much data is injected and which indexer is down ?`,
       "text": `<p>index=_internal idx=* earliest=\`-1d@d\` latest=now() |eval Size = b/(1024/1024/1024)|table Size</p>\n<p>to identify which Indexer is down we can again run a simple command - index=_internal source=\`*splunkd.log*\`\`*Connection failure*\` - By running this command you will get to know the indexerIP which is having connection failure.</p>`
    },
    {
       "command": `Different configuration files you worked with ?`,
       "text": `<ul>\n<li>inputs.conf</li>\n<li>outputs.conf</li>\n<li>props.conf</li>\n<li>transforms.conf</li>\n</ul>`
    },
    {
       "command": `How do you reset admin password ?`,
       "text": `<p>Stop Splunk Enterprise\nFind the passw file for your instance ($SPLUNK_HOME/etc/passwd) and rename it to passwd.bk\nCreate a file named user-seed.conf in your $SPLUNK_HOME/etc/system/local/ directory.\nIn the file add the following text:\n[user_info]\nPASSWORD = NEW_PASSWORD\nIn the place of \`NEW_PASSWORD\` insert the password you would like to use.\nStart Splunk Enterprise and use the new password to log into your instance from Splunk Web.\nIf you previously created other users and know their login details, copy and paste their credentials from the passwbk file into the passwd file and restart Splunk.\n</p>`
    },
    {
       "command": `How to identify which port splunk is running on ?`,
       "text": `<p>Go to /bin and run the following command - ./splunk show web-port\nto know the management port, run this command - ./splunk show splunkd-port</p>`
    },
    {
       "command": `Monitor entire health of system ? which component do you login to see the dashboard ?`,
       "text": `<p>monitoring console application - This is a pre-built application</p>`
    },
    {
       "command": `How do you update the indexer when there is a new index to be added ?`,
       "text": `<p>Login to Splunk web, go to setting > indexes >new</p>`
    },
    {
       "command": `How do you identify which machine is not reporting to splunk ?`,
       "text": `<p>Login to Deployment server - Check for the deployment client, i.e. Universal Forwarder and check for the phone home interval - if the Phone home interval is longer than usual, ex, 24 hours ago, 3 days ago that means the machine is no longer reporting to Splunk</p>`
    },
    {
       "command": `How you deploy app in SH ?`,
       "text": `<p>Through Deployer - Deployer configuration has already been explained above.</p>`
    },
    {
       "command": `Change retention period in Indexer ? What is the config file ?`,
       "text": `<p>Retention period can be changed by editing - Indexes.conf</p>`
    },
    {
       "command": `Which bucket is not searchable ?`,
       "text": `<p>Frozen and Thawed buckets</p>`
    },
    {
       "command": `How to add new indexer to cluster?`,
       "text": `<p>Go to Settings > Indexer Clustering > Add peer node - Give master URI. Since it is a new cluster member, you need to run this command so that all data is synced with this cluster as well. The command is - splunk apply cluster-bundle</p>`
    },
    {
       "command": `If my indexer is down....How to troubleshoot?`,
       "text": `<p>If one of the indexer cluster members is down, follow a simple process of restarting splunk. After that go to, /opt/splunk and see if you can loop through this directory without any error like,<strong>File or directory doesn't exists.</strong> If this error persists again and again then check _internal logs in search bar and see what kind of exception has occurred that has caused peer node to go down. Alternatively you can go to /opt/splunk/var/log/splunk/splunkd.log and check for latest 10, 000 entries. Third way would be to go to Monitoring Console app and check for the status of the down peer and see what diagnostic metrices are there. Fourth way would be to go to Settings > Health Card Manager and see what is the status of indexer cluster. if the status for several parameters is in RED that means there is some issue on the server backend as well, it's now time for you to involve server teams as well since it might be a server crash issue as well.</p>\n<p>Normally when a indexer cluster member having searchable copies goes down, the _raw copies of data gets converted to searchable files (tsidx). Master node in this case takes care of bucket fixing, that is tries to keep the match with the Replication factor you've set up.</p>`
    },
    {
       "command": `what is search affinity splunk?`,
       "text": `<p>In case of Mutisite cluster, search affinity refers to setting up search heads in a way that they must only query for results from their local site, that is the site that is nearest to them. Example, if you have a multisite cluster in 2 different sites, namely, Rochelle and Hudson. Now if a user searches for any data from Rochelle, all the search requests must go to Indexer clusters which are in Rochelle zone and similar for hudson site as well. Setting up search affinity helps in reducing latency within networks.</p>`
    },
    {
       "command": `Any experience in creating custom apps ?`,
       "text": `<p>NO</p>`
    },
    {
       "command": `What is maintainance mode ?`,
       "text": `<p>Also called as halt mode because it prevents any bucket replication within indexer cluster. Example, in case you are upgrading your splunk from 7.X to 8.X you need to enable maintenance mode. To enable maintenence mode, you need to go to Master node and run command, splunk enable maintenance-mode. After the maintenance activity has occurred you can run, splunk disable maintenance-mode.</p>`
    },
    {
       "command": `What does maintainance mode do ?`,
       "text": `<p>Maintenance mode will halt all buckets fixups, meaning, if there is any corrupt bucket it will not be fixed to normal. Also, maintenance mode will not check for conditions like, Replication factor is not met or Search factor is not met. It also prevents timely rolling of Hot buckets to warm buckets.</p>\n<p>50% of searchheads are down ? what will happen? How to resolve? ----------Run, splunk show shcluster-status to see if the captain is also down. In this case you need to setup a static captain as follows - ./splunk edit shcluster-config -mode captain -captain_uri https://SHURL:8089 -election false. In case you have 4 SH members and 2 went down that means your default replication factor which is set to 3 will not be met. In this case you can reinstantiate a SH cluster with following command as follows by setting the RF to 2. Here is the command, ./splunk init shcluster-config -auth username:password -mgmt_uri https://shheadURI:8089 -replication_port 9000 -replication_factor 2 -conf_deploy_fetch_url http://DeployerURL:8089 -secret deployerencyptedpassword -shcluster_label labelName.</p>`
    },
    {
       "command": `what are the Challenges you are faced?`,
       "text": `<p>HERE YOU CAN GIVE ANY EXAMPLE.</p>`
    },
    {
       "command": `How to upgrade the version from scratch?`,
       "text": `<p>Enable Maintenance Mode. take a backup of all splunk artifacts to some repository or to some backup server. Install the newer package using wget utility on linux machines and getting the windows installer on windows. Keep using Monitoring console and Health card report manager to check the status of your Splunk instances.</p>`
    },
    {
       "command": `What is Base search and child search or post process search?`,
       "text": `<p>Base search or post process searches are used for optimising Splunk searches run time. There will be one search that will be executed once and same search can be used in multiple panels of a dashboard. To create a base search, do the following, <search id=\`basesearchID\`> and then use <search base=\`basesearchID\`> in all the panels that will be using the base search.</p>`
    },
    {
       "command": `What is the average time taken to ingest the 500gb data ?`,
       "text": `<p>Depends on how the ingestion is happening.</p>`
    },
    {
       "command": `If deployment server went down ? how to resolve? What is the impact?`,
       "text": `<p>The main purpose why we used DS is to distribute apps and updates to a group of non-clustered Splunk instances. In case DS went down all the Deployment clients polling to DS will not get the latest set of apps and updates.</p>`
    },
    {
       "command": `If cluster master went down ? how to resolve? What is the impact?`,
       "text": `<p>Cluster master is responsible for managing the entire Indexer cluster members. In case, CM goes down replication between different iNDEXER MEMBERS will not happen. A user search will randomly land in one of the indexer member cluster and Co-ordination will break. As part of remedy, restart splunkd on Cluster master and look for it's internal logs on other cluster members. To resync equal data between all members, run - splunk apply cluster-config and also splunk resync cluster-config commands individually in all Cluster members so that all the members have same set of data.</p>\n<p>After that you can randomly run, |rest /servicesNS/-/-/data/ui/views and |rest /servicesNS/-/-/saved/searches REST calls in any of the indecer members to see if all the default ARTIFACTS are same across all member nodes.</p>`
    },
    {
       "command": `How many servers do we need to ingest tha 300gb data? How can you segregate the data?`,
       "text": `<p>You can make use of https://splunk-sizing.appspot.com/ website to make selection on amount of bandwidth you may require.</p>\n<p>Segregation of data must always happen based on SOURCETYPE</p>\n<p>At a time 10 persons searching for same query but only 6 members getting the query remaining not why? - Depends on no. of VCPUs that your infrastructure supports. Let's say if you are having 3 Search head members with 2 VCPUs each that means only 2*3 = 6 Concurrent searches can run at a time. You need to increase your throughput by adding more CPUs for concurrent processing.</p>`
    },
    {
       "command": `How to check kv store status?`,
       "text": `<p>Splunk show kvstore-status</p>`
    },
    {
       "command": `What is SDK framework?`,
       "text": `<p>Software development kit. SDK is a framework provided by Splunk for creating custom apps once that could be used for third party tools integration, connecting to Kafka clusters and many more similar things. As Splunk says it, SDK framework is used for creating, SPLUNK APPS FOR DEVELOPERS.</p>`
    },
    {
       "command": `Hot to warm rolling conditions ?`,
       "text": `<p>Based on retention policy of Hot bucket and maximum size of each bucket. You can use |dbinspect indexname command to get the bucket info about any index. Alternatively, you can also vi indexes.conf to get info about hot and warm buckets.</p>`
    },
    {
       "command": `What is the background process to ingest the data into the splunk ?`,
       "text": `<p>Install UF on any machine using the wget utiliy supported by splunk/downloads, once this is done loop through, /opt/splunkforwarder directory, if you can successfully loop through this directory that means UF package is successfully installed. Run, splunk enable boot-start so that UF is always available at run time.</p>\n<p>You can also use STATSD and COLLECTD as a background process to ingest data into Splunk. Both, STATSD and COLLECTD uses UDP to transmit data compared to UF which uses TCP to transmit data.</p>`
    },
    {
       "command": `What is the role of captain ?how can we define captain ?`,
       "text": `<p>Captain takes care of replication and managing searches efficiently between different search head members. Captain can be defined as follows - ./splunk bootstrap shcluster-captain -servers_list “https://shmemberURI:8089, otherSHmembersURI”</p>\n<p>you running the Apply bundle command?what is background process ? - Splunkd</p>`
    },
    {
       "command": `How to onboard the AD Logs in to Splunk?How to onboard the data through Splunk Add-on?`,
       "text": `Settings > Data and Inputs > Continuously monitor > filename > Ingest using add-on (From dropdown select the add-on name).`
    },
    {
       "command": `How to onboard the syslog data from the scratch?`,
       "text": `<p>Use an agent like http event collector or REST APIs to first send all the syslog data to syslog-NG server and within the syslogNG servers you can install UF package from where you can ingest the data to Splunk indexers.</p>`
    },
    {
       "command": `How to ingest teh data from routers to Splunk?`,
       "text": `<p>- SAME APPRAOCH AS ABOVE</p>`
    },
    {
       "command": `Events time is showing feture timestamp? what is the reason? How to fix this issue?`,
       "text": `<p>Look for the timestamp column been used from the log files to ingest data. The column might be having future timestamps pertaining to future migrations dates or DR activities for example. In your UF for to indexes.conf and set a parameter, time=Date.</p>`
    },
    {
       "command": `How to optimize the Splunk Query in real time ?`,
       "text": `<p>There are lot of techniques - Base searches for dashboards, Filter as early as possible, avoid using wildcards, Inclusion is always better than exclusion. Example, search specifically for status = 50* rather than searching for |search NOT status=50*.</p>\n<p>Use summary indexes to speed up search operations</p>\n<p>Use Report Acceleration to speed up report execution time.</p>\n<p>Use data models which can be used within lot of other saved searches like dashboards and reports.</p>\n<p>Index = abc | delete ….after deleting the data how we can retrieve the data ? ------- Delete command makes data unavailable from the index. It never reclaims disk space. You can always get the data back from your disk even after you run delete command</p>`
    },
    {
       "command": `Diff between dashboard and form ?`,
       "text": `<p>Dashboard is a view. A form incorporates entire dashboard code by means of a form name. You can refer form name while calling low level APIs for Splunk integration with third-party apps.</p>`
    },
    {
       "command" : `Alerts and reports are stored in where ?`,
       "text" : `<p>- /opt/splunk/ ..... /saved/searches.</p>`
    },
    {
       "command": `Alert didn’t trigger ? reason ?How to troubleshoot? `,
       "text": `<p>Run the following command - |rest /services/search/jobs \`Alert Name\`. This will tell you when the alert has last ran. You can also run the following command if you have admin permissions - index=_audit \`Alert Name\` - This will tell you what time the alert took to run and when it was last executed. Run, index=_internal to get the diagnostics metrics for the same alert name.</p>\n<p>You can also run, |rest /servicesNS/-/-/saved/searches |search cron_schedule = \`0 *\` (Give the wildcard cron schedule for the alert and check if there are lot of concurrent saved searches running at same interval of time. Try changing the schedules of other alerts and reports by 1-2 mins ahead or behind).</p>`
    },
    {
       "command": `what is the difference between top and head?`,
       "text": `<p>Top gives you a list of most common field values along with a percentage of how frequently it is present compared to other field values. Head command just gives initial few results based on the query specified. Example, there is a field called price which has values as, 20, 30, 40, 50, 60, 70, 80, 90, 20, 30, 40, 20. When you run, |top price, this command will give you price value as 20 in first row because 20 is appearing maximum no. of 3 times in all price field values, it will also show the percentage of how many times value 20 is appearing. Similarly, if you run - |head 5 price it will give you this as the output - 20, 30, 40, 50, 60.</p>`
    },
    {
       "command": `What is the REST API?`,
       "text": `<p>REST APIs are a path to specific locations or directories for accessing different types of knowledge objects. Example by using, |rest /servicesNS/-/-/saved/searches, you can get a list of all reports and alerts. Similarly by running, |rest /servicesNS/-/-/data/ui/views, you can get a list of all dashboards and so on.</p>`
    },
    {
       "command": `Have you migrated any knowledge objects from one environment to another environment?`,
       "text": `<p>Yes, you can do them with the help of REST APIs as explained above.</p>`
    },
    {
       "command": `Where we can find the path of dashboard?`,
       "text": `<p>Use rest /servicesNS/-/-/data/ui/views |search eai.acl_app = * label=\`Dashboard_title\`|table eai.acl_app label</p>`
    },
    {
       "command": `What is the difference between stats eventstats and streamstats?`,
       "text": `<p>Stats command will give you everything in tabular format. You cannot use stats command evaluation fields in the later part of the search. Example, if you do |stats sum(price) as Sum_Price by Product_Name and later you do |table price Product_Name, you will see NULL values for price field. Eventstats is helpful in these cases, Eventstats adds corresponding output to each event and you can also re-use the evaluation field in the later part of searches as well. Example, |eventstats sum(price) as Sum_Price by Product_Name and later you do |table price Product_Name, you will see actual values for the price field as well compared to stats command. Streamstats gives running calculation for any field name specified plus it also keeps the original value of a field name the same. Example, price field has values as, 20, 30, 40, 50. after you do, |streamstats sum(price) as Sum_Price by Product_Name, you will see that in the first row output will be 20, in the second it will be 50 (20+30), in the third line it will be 90 (50+40) and so on. Later if you do |table price Product_Name, you can also see actual values for the price field.</p>`
    },
    {
       "command": `How do you identify how much data is injected and which indexer is down ?`,
       "text": `<p>index=_internal idx=* earliest=\`-1d@d\` latest=now() |eval Size = b/(1024/1024/1024)|table Size</p>\n<p>To identify which Indexer is down we can again run a simple command - index=_internal source=\`*splunkd.log*\`*Connection failure* - By running this command you will get to know the indexerIP which is having connection failure.</p>`
    },
    {
       "command": `Different configuration files you worked with ?`,
       "text": `<ul>\n<li>inputs.conf</li>\n<li>outputs.conf</li>\n<li>props.conf</li>\n<li>transforms.conf</li>\n<li>server.conf</li>\n<li>serverclass.conf</li>\n<li>indexes.conf</li>\n</ul>`
    },
    {
       "command": `How do you reset admin password ?`,
       "text": `<p>Stop Splunk Enterprise. Find the passwd file for your instance ($SPLUNK_HOME/etc/passwd) and rename it to passwd.bk. Create a file named user-seed.conf in your $SPLUNK_HOME/etc/system/local/ directory. In the file add the following text: [user_info] PASSWORD = NEW_PASSWORD. In the place of \`NEW_PASSWORD\` insert the password you would like to use. Start Splunk Enterprise and use the new password to log into your instance from Splunk Web. If you previously created other users and know their login details, copy and paste their credentials from the passwbk file into the passwd file and restart Splunk.</p>`
    },
    {
       "command": `How to identify which port splunk is running on ?`,
       "text": `<p>Go to /bin and run the following command - ./splunk show web-port to know the management port, run this command - ./splunk show splunkd-port</p>`
    },
    {
       "command": `Monitor entire health of system ? which component do you login to see the dashboard ?`,
       "text": `monitoring console application - This is a pre-built application`
    },
    {
       "command": `How do you update the indexer when there is a new index to be added ?`,
       "text": `Login to Splunk web, go to setting > indexes >new`
    },
    {
       "command": `How do you identify which machine is not reporting to splunk ?`,
       "text": `<p>Login to Deployment server - Check for the deployment client, i.e. Universal Forwarder and check for the phone home interval - if the Phone home interval is longer than usual, ex, 24 hours ago, 3 days ago that means the machine is no longer reporting to Splunk</p>`
    },
    {
       "command": `How you deploy app in SHcluster ?`,
       "text": `<p>First we need to download the splunkbase and copy to $SPLUNK_HOME/etc/shcluster in Deployer and then need to push to searchhead members from the deployer splunk apply shcluster-bundle</p>`
    },
    {
       "command": `Change retention period in Indexer ? What is the config file ?`,
       "text": `<p>Retention period can be changed by editing - Indexes.conf frozenTimePeriodInSecs =</p>`
    },
    {
       "command": `Which bucket is not searchable ?`,
       "text": `<p>Once reached data to frozen bucket, we are not able to searchable</p>`
    },
    {
       "command": `How you ensure data availability across the Splunk Infrastructure?`,
       "text": `<p>To ensure that high availability of data in environment, if one peer goes down, it should not affect end user. So in indexer cluster, one peer goes down then another peer comes to picture and serves the data to end user.</p>`
    },
    {
       "command": `What is Replication Factor and Search Factor`,
       "text": `<p>RF :: No of copies of raw data, its equal or less than no of peers in cluster. RF depends on probability of network down tolerance. SF: : No. of copies of index file, its equal or less than no of RF.</p>`
    },
    {
       "command": `What will happen if peer goes down?`,
       "text": `<p>Every 60Sec, master sends the heartbeat frequency to all peers then all peers should reply to that heartbeat frequency.</p>`
    },
    {
       "command": `What will happen if master goes down? `,
       "text": `<p>Peer tries to call to master when it gets the data form UF, if master does not respond it will wait 60 sec then again try to contact to master like this 3 time it will do, after that peer will go to the previous history of master server suggested until 24 hours. After 24 hours that previous history also delete then peers act as standard lone.</p>`
    },
    {
       "command": `Difference between valid and complete cluster?`,
       "text": `<p>Valid is nothing but non-searchable copy. Complete is nothing but searchable copy. Searchable is nothing but which have both replication factor and search factor.</p>`
    },
    {
       "command": `How to implement Indexer Clustering`,
       "text": `<p>In master[clustering] Mode=master Replication_factor= 3 Search_factor = 2 Pass4symmkey=apple In peer [replication_port: //9080] [clustering] Master_uri=https: //1.1.1.1:8089 Mode=slave Pass4symmkey=apple In search head [clustering] Master_uri=https: //1.1.1.1:8089 Mode=search head Pass4symmkey=apple Via GUI Settings indexer cluster enable cluster - indexer ip : 8089 credentials and secret key</p>`
    },
    {
       "command": `How to upgrade the cluster?`,
       "text": `<p>First, we have to upgrade the master then immediately enable the maintenance mode. After the upgrade the peers one by one then upgrade the search head. Then disable the maintenance mode ./splunk enable maintenance-mode ./splunk disable maintenance-mode</p>`
    },
    {
       "command": `Where I can check health of my cluster?`,
       "text": `<p>In indexer master dash board, we can see</p>`
    },
    {
       "command": `Is it possible to exclude an index from replication?`,
       "text": `<p>Yes, we can exclude.Repfactor= auto Repfactor=0 (exclude)</p>`
    },
    {
       "command": `How to push common configuration to peers in single shot?`,
       "text": `<p>./splunk apply cluster-bundle</p>`
    },
    {
       "command": `How searches will get processed in Indexer cluster architecture `,
       "text": `<p>End user run the query in search head, SH contact to master then master guide to SH about which indexer have to go.</p>`
    },
    {
       "command": `Diff between standalone search head and clustered search head `,
       "text": `SH:: its wont replicate the splunk knowledge objects SHC: : in SHC replicate the splunk knowledge objects`
    },
    {
       "command": `How to restart all the peers in one shot?`,
       "text": `<p>By using rolling restart command ./splunk rolling-restart cluster-peers</p>`
    },
    {
       "command": `. What are the changes to do in conf files for multisite? `,
       "text": `<p></p>`
    },
    {
       "command": `Do we need to declare site info in Master and Searchhead as well?`,
       "text": `<p></p>`
    },
    {
       "command": `Is it okay to have Search head as Indexer Master?`,
       "text": `<p>Strictly no, its should be separate components, because master have very critical activities. Its tracking and monitoring of all components in cluster mean what indexer doing and when indexer got the data, in which time replicate the index and what time search head search the data, these all things are recording in indexer master. So master is very critical activates doing. That’s why not assign any other activities. If you assign any activities, after 3 to 4 days it wont work properly.</p>`
    },
    {
       "command": `Can a single server act as Master as well as peer? `,
       "text": `Strictly no, its should be separate components, because master have very critical activities. Its tracking and monitoring of all components in cluster mean what indexer doing and when indexer got the data, in which time replicate the index and what time search head search the data, these all things are recording in indexer master. So master is very critical activates doing. That’s why not assign any other activities. If you assign any activities, after 3 to 4 days it wont work properly. `
    },
    {
       "command": ` Can we have Master as 6.4 and peers as 6.3?`,
       "text": `No, it won't support, in cluster environment all components have same OS as well as same version of splunk software`
    },
    {
       "command": `Can we have Master as Windows and peers as combination of *nix flavors`,
       "text": `No, it wont support, in cluster environment all components have same OS as well as same version of splunk software`
    },
    {
       "command": `How to maintain License for Standalone Indexer`,
       "text": `<p></p>`
    },
    {
       "command": `Do we need to include license for Search head`,
       "text": `<p>No need, license is for indexing only </p>`
    },
    {
       "command": `Are we able to convert HF with forwarder License.`,
       "text": `Yes, if we uase forwarder license in HF then automatically disable index in HF. `
    },
    {
       "command": `How to maintain License for Clustered Architecture `,
       "text": `<p>By using license master, it manage and control the license slaves. From the license master we can define pools, adding license and manage license.</p>`
    },
    {
       "command": ` What is License pool and its allocation`,
       "text": `<p>License pool manage license slaves, license pool assign particular space to group of indexers.</p>`
    },
    {
       "command": `What is the workflow of Splunk Licensing`,
       "text": `<p></p>`
    },
    {
       "command": `What will happen if your license is expired on a particular calendar day?`,
       "text": `<p>If license is expired, we cannot able to search and there is no effect on indexing the data in indexer. We will get the 5 alert messages in 30days, after the indexing also not happen.</p>`
    },
    {
       "command": `How to connect standalone indexers with Search head.`,
       "text": `<p>Via GUI :: We have to do binding in SH - settings - distributed search search peers indexer Ip: 8089 indexer credentials then restart Via Configuration : : we have to give the Indexers in distserach.conf file /opt/splunk/etc/syaytem/local Vi distsearch.conf[distributedSearch] Servers = 1.1.1.1: 8089, 2.2.2.2: 8089 ;wq! Then we have to copy the trusted.pem file of search head and paste to indexer. /opt/splunk/etc/distserverkeys</p>`
    },
    {
       "command": `. I want to deploy a common change to all of my forwarders. Is it possible to take a central control server`,
       "text": `<p>DS is centralized management of forwarders and instated of frequently login to Application server for create and modify inputs and outputs file, by using DS we just push configuration files to deployment client. And its also called as forwarder management. </p>`
    },
    {
       "command": ` What are pre-requisitesfor Splunk installation`,
       "text": `<ul><li> - Root access1 GB space df -h</li> ->Supported OS uname -a Default ports availability netstat -an | grep 8000 or 8089</ul>`
    },
    {
       "command": ` Is it possible to change the Splunk default ports`,
       "text": `<p>Yes, /opt/splunk/etc/syaytem/local Vi web.conf [settings] httpPort=80001 mgmtHomePort = 127.0.0.1: 8090 wq! Note : : after installation and before start the splunk services only we have to change this.</p>`
    },
    {
       "command": `Is it ok to load Indexer and Search head capability in a singlecomponent?`,
       "text": `<p>Yes.indexer have capability ofsearching But it will impact indexer performance. So its good to create a standalone SH.</p>`
    },
    {
       "command": `What is major difference between UF and HF `,
       "text": `<p>UF is having only the forwarding capability. But HF having capabilities of forwarding, filtering and masking of the data.</p>`
    },
    {
       "command": `What is phonehome interval ? Are we able to tune it?`,
       "text": `<p>By default every 60 sec Deployment client contact to Deployment server, this process is called phoning and this time of interval is called phone home interval. Yes we are able to tune it in deploymentclient.conf</p>`
    },
    {
       "command": `Are we able to disable the web`,
       "text": `<p>Yes 3 methods are available via UI / web.conf / CLI command Via GUI : : Settings Server Settings General Settings Check Run SplunkWeb as No</p> Via CLI : : <p>./splunk disable webserver</p> <p>./splunk enable webserver</p> Via configuration: :  <p>Go to web.conf</p> <p>Add this stanza under [settings]</p> <p>startwebserver=0</p> <p>If 0 means disabling the web</p> <p>If 1 means enabling the web</p>`
    },
    {
       "command": `How to restrict specific users not to see few index dataset`,
       "text": `<p>While creating roles, enable access only to required index </p>`
    },
    {
       "command": `What are Splunk capabilities `,
       "text": `<p></p>`
    },
    {
       "command": `What isthe difference betweeen Sourcetype overriding and Sourcetype renaming`,
       "text": `<p>Sourcetype override isto assign different sourcetype for few sets of data -- It is through writing rules in props Source type rename isto completely rename the existing sourcetype name </p>`
    },
    {
       "command": ` Are we able to collect traps from network devices`,
       "text": `<p>Yes we are able to collect traps from SNMP devices </p>`
    },
    {
       "command": `Is it possible to filter the inputs section `,
       "text": `<p>Yes. Use whitelist and blacklist in inputs.conf</p>`
    },
    {
       "command": `Shall i use receiving port as replication port in indexers`,
       "text": `<p>No. Replication port should be unique</p>`
    },
    {
       "command": `What isrepository and target repository location`,
       "text": `<p>Repository Location is nothing but in Deployment server, which location the folder having inputs and outputs file for ready to push to deployment client that’s is called repository location</p> <p>/opt/splunk/etc/deployment-apps</p><p>Target Repo Location is where folders has to keep in client side - It isin UF side</p><p>/opt/splunkforwarder/etc/apps</p></p>`
    },
    {
       "command": `What is dispatch directory and are we able to take control over it?`,
       "text": `<p>Dispatch directory is nothing but whatever search in search head bar its going to store that records</p> <p>/opt/splunk/var/run/splunk/dispatch</p> <p>/opt/slunk/bin</p> <p>./splunk cmd splunkd clean-dispatch /tmp -24h@h</p><p>Using limits.conf we can control these settings</p><p>Adhoc search - 10 minutes</p><p>## Global behaviour via limits.conf</p><p>limits.conf</p><p>[search]</p><p>ttl = 600</p><p># default - 10 mins</p><p> [subsearch]</p><p>ttl = 300</p><p># default - 5 mins</p>`
    },
    {
       "command": `I am having a log file in which few dataset wants to send to Index A and remaining few to IndexB. Is that possible`,
       "text": `<p>Yes you can do this. But you need to write Index overriding rules in HF and forward few data to A index and remaining few to B index based on key words</p>`
    },
    {
       "command": `What is metadata in Splunk `,
       "text": `<p>Metadata is data about data ( Data which is referring to identify my data - Source / Sourcetype / Host ) </p>`
    },
    {
       "command": `What are the basic troubleshooting steps if you not receive your data in indexer end.`,
       "text": `<p>First we need to check the communication between UF and Indexer then Then need to check in monitor stanza, given correct path and available index or not. Check the splunkd logs for know exact isuue. </p>`
    },
    {
       "command": `If index and sourcetype is not created in Indexer but referred in inputs. Will Splunk create that automatically?`,
       "text": `<p>Splunk will not create automatically any index. If index is not present it will throw you an error ( if u not mention any index name in monitor stanza it will go to default index MAIN. Splunk will create sourcetype automatically. It willstrip last part from source</p>`
    },
    {
       "command": `What kind of data splunk is going to read? `,
       "text": `<pStructured as well as unstructured and its Expecting timestamps. Its cannot able to read binary files.</p>`
    },
    {
       "command": `How data traverse from application environment to splunkinfrastructure`,
       "text": `<p>Explain Forwarding process ( Setting up forwarder and enable the indexer ) TCP channel ( Why tcpout matters )Receiving port ( Indexer port)</p>`
    },
    {
       "command": `Is there any way I can assure that all of my data reached at Splunk Infrastructure`,
       "text": `<p>Due to useACK mechanism, forwarder send the 64 byte of data to indexer and it will wait 60 sec for indexer acknowledgement, if its not response it will send the data to another indexer in same manager. By Default useACk is false, we have to enable in outputs.conf file.</p>`
    },
    {
       "command": ` How forwarder deals with failure`,
       "text": `<p>Due to autoLB. If one indexer is not available it will look for alternative. By default autoLB is true.</p>`
    },
    {
       "command": `Isthere any way to neglect my old historical data before get into Splunk receiver`,
       "text": `<p>During onboard time, we have to check with application team for gathering is there any historical data and historical log files. If isthere we have to ignore that data by ignoreolderthan attribute in inputs.conf files</p>`
    },
    {
       "command": `Isthere any way to segregate and discard few unwanted data from a single file before reaches the index queue`,
       "text": `<p>In HF, we have to create the transforms and propsfiles for discard the data</p> <ul> <li>Transforms.conf</li> <li>[discardingdata ]</li> <li>REGEX=(i?) error</li> <li>DEST_KEY=queue</li><li>FORMAT=nullQueue</li><li>Props.conf</li><li> [Sourcetype]</li> <li>TRANSFORMS-abc = discardingdata</li></ul>`
    },
    {
       "command": `Am I able to mask customer sensitive data before it reaches the index queue`,
       "text": `<p>Yes we can by using Masking rules in props and transforms in HF.</p>`
    },
    {
       "command": `. I am in need of transferring five 10 GB files. How much disk space do i need to maintain in my indexer`,
       "text": `<p>5*10=50GB=Actual data Actual data = 10% raw data + (10 to 110%) of raw data = ¼ of actual data = 5 + 6.5 = round of 12.5 GB space required.</p>`
    },
    {
       "command": `What is the default path of index `,
       "text": `<p>/opt/splunk/var/lib/splunk/</p>`
    },
    {
       "command": `How to set the index retention policy`,
       "text": `<p>frozentimeperiodinSecs::data is going to delete at particular point, even though coldDB has free space maxTotalDataSize : : its size of total index</p>`
    },
    {
       "command": `what happen if cluster master down? `,
       "text": ``
    },
    {
       "command": `how cluster master knows if peer down?`,
       "text": ``
    },
    {
       "command": `when roll-over hot to warm backets?`,
       "text": ``
    },
    {
       "command": `why need index cluster..?`,
       "text": ``
    },
    {
       "command": `what is diff b/w search head and indexer?`,
       "text": ``
    },
    {
       "command": `what is diff b/w indexer cluster and search head cluster..?`,
       "text": ``
    },
    {
       "command": `how to apply bundles in cluster?`,
       "text": ``
    },
    {
       "command": `how to restart peers in cluster?  `,
       "text": ``
    },
    {
       "command": `How you know retention of data in buckets? `,
       "text": ``
    },
    {
       "command": `Edureka Splunk Interview Questions and Answers`,
       "text": `<p>The questions covered in this blog post have been shortlisted after collecting inputs from many industry experts to help you ace your interview. In case you want to learn the basics of Splunk then, you can start off by reading the first blog in my Splunk tutorial series:  All the best!</p>`
    },
    {
       "command": `What is Splunk? Why is Splunk used for analyzing machine data?`,
       "text": `<p>This question will most likely be the first question you will be asked in any Splunk interview. You need to start by saying that:</p> <ul> <li>Splunk is a platform which allows people to get visibility into machine data, that is generated from hardware devices, networks, servers, IoT devices and other sources   </li> <li>Splunk is used for analyzing machine data because it can give insights into application management, IT operations, security, compliance, fraud detection, threat visibility etc </li> </ul> `
    },
    {
       "command": `Explain how Splunk works.`,
       "text": `<p>This is a sure-shot question because your interviewer will judge this answer of yours to understand how well you know the concept. The Forwarder acts like a dumb agent which will collect the data from the source and forward it to the Indexer. The Indexer will store the data locally in a host machine or on cloud. The Search Head is then used for searching, analyzing, visualizing and performing various other functions on the data stored in the Indexer.</p> <ul> <li>Act like an antivirus policy server for setting up Exceptions and Groups, so that you can map and create different set of data collection policies each for either a windows based server or a linux based server or a solaris based server</li><li> Can be used to control different applications running in different operating systems from a central location</li> <li>Can be used to deploy the configurations and set policies for different applications from a central location.</li> </ul><p>Making use of deployment servers is an advantage because connotations, path naming conventions and machine naming conventions which are independent of every host/machine can be easily controlled using the deployment server. </p> `
    },
    {
       "command": `Why use only Splunk? Why can’t I go for something that is open source?`,
       "text":`<p>This kind of question is asked to understand the scope of your knowledge. You can answer that question by saying that Splunk has a lot of competition in the market for analyzing machine logs, doing business intelligence, for performing IT operations and providing security. But, there is no one single tool other than Splunk that can do  all of these operations and that is where Splunk comes out of the box and makes a difference. With Splunk you can easily scale up your infrastructure and get professional support from a company backing the platform. Some of its competitors  are Sumo Logic in the cloud space of log management and ELK in the open source category. You can refer to the below table to understand how Splunk fares against other popular tools feature-wise. The detailed differences between these tools are covered in this blog:</p>`
    },
    {
       "command": `Which Splunk Roles can share the same machine?`,
       "text": `<p>This is another frequently asked Splunk interview question which will test the candidate’s hands-on knowledge. In case of small deployments, most of the roles can be shared on the same machine which includes Indexer, SearchHead and LicenseMaster. However, in case of larger deployments the preferred practice is to host each role on stand alone hosts. Details about roles that can be shared even in case of larger deployments are mentioned below: <ul>  <li>Strategically, Indexers and Search Heads should have physically dedicated  machines. Using Virtual Machines for running the instances separately is not the solution because there are certain guidelines that need to be followed for using computer resources and spinning multiple virtual machines on the same physical hardware can cause performance degradation.</li> <li>However, a License master and Deployment server can be implemented on the same virtual box, in the same instance by spinning different Virtual  machines.  </li> <li>You can spin another virtual machine on the same instance for hosting the Cluster master as long as the Deployment master is not hosted on a parallel virtual machine on that same instance because the number of connections coming to the Deployment server will be very high.</li> <li>This is because the Deployment server not only caters to the requests  coming from the Deployment master, but also to the requests coming from the Forwarders.</li> </ul> </p>`
    }, 
    {
       "command": `What are the unique benefits of getting data into a Splunk instance via Forwarders?`,
       "text": `<p>You can say that the benefits of getting data into Splunk via forwarders are bandwidth throttling, TCP connection and an encrypted SSL connection for  transferring data from a forwarder to an indexer. The data forwarded to the indexer is also load balanced by default and even if one indexer is down due to network outage or maintenance purpose, that data can always be routed to another indexer instance in a very short time. Also, the forwarder caches the events locally before forwarding it, thus creating a temporary backup of that data.</p>`
    },
    {
       "command": `Briefly explain the Splunk Architecture `,
       "text": `<p>Look at the below image which gives a consolidated view of the architecture of Splunk. You can find the detailed explanation in this link: </p>`
    },
    {
       "command": ` What is the use of License Master in Splunk?`,
       "text": `<p>License master in Splunk is responsible for making sure that the right amount of data gets indexed. Splunk license is based on the data volume that comes to the platform within a 24hr window and thus, it is important to make sure that the  environment stays within the limits of the purchased volume. Consider a scenario where you get 300 GB of data on day one, 500 GB of data the  next day and 1 terabyte of data some other day and then it suddenly drops to 100 GB on some other day. Then, you should ideally have a 1 terabyte/day licensing model. The license master thus makes sure that the indexers within the Splunk deployment have sufficient capacity and are licensing the right amount of data.</p> `
    },
    {
       "command": `what happens if the License Master is unreachable?`,
       "text": `<p>In case the license master is unreachable, then it is just not possible to search the data. However, the data coming in to the Indexer will not be affected. The data will continue to flow into your Splunk deployment, the Indexers will continue to index the data as usual however, you will get a warning message on top your Search head or web UI saying that you have exceeded the indexing volume and you either need to reduce the amount of data coming in or you need to buy a higher capacity of license.</p> <p>Basically, the candidate is expected to answer that the indexing does not stop; only searching is halted.</p> ` 
    },
    {
       "command": ` Explain ‘license violation’ from Splunk perspective.`,
       "text": `<p>If you exceed the data limit, then you will be shown a ‘license violation’ error. The license warning that is thrown up, will persist for 14 days. In a commercial license  you can have 5 warnings within a 30 day rolling window before which your Indexer’s  search results and reports stop triggering. In a free version however, it will show only 3 counts of warning.</p>`
    },
    {
       "command": ` Give a few use cases of Knowledge objects.`,
       "text": `<p>Knowledge objects can be used in many domains. Few examples are:</p> <p><strong>Physical Security: </strong>  If your organization deals with physical security, then you can leverage data containing information about earthquakes, volcanoes, flooding, etc to gain valuable insights</p><p><strong>Application Monitoring: </strong> By using knowledge objects, you can monitor your applications in real-time and configure alerts which will notify you when your application crashes or any downtime occurs</p> <p><strong>Network Security: </strong> You can increase security in your systems by blacklisting certain IPs from getting into your network. This can be done by using the Knowledge object called lookups</p> <p><strong>Employee Management:</strong> If you want to monitor the activity of people who are serving their notice period, then you can create a list of those people and create a rule preventing them from copying data and using them outside</p> <p><strong>Easier Searching Of Data: </strong> With knowledge objects, you can tag information, create event types and create search constraints right at the start and shorten them  so that they are easy to remember, correlate and understand rather than writing long searches queries. Those constraints where you put your search conditions, and  shorten them are called event types. These are some of the operations that can be done from a non-technical perspective  by using knowledge objects. Knowledge objects are the actual application in business, which means Splunk interview questions are incomplete without Knowledge objects. In case you want to read more about the different knowledge objects available and how they can be used, read this blog:  </p>  `
    },
    {
       "command":` Why should we use Splunk Alert?What are the different options while setting up Alerts?`,
       "text": `<p>This is a common question aimed at candidates appearing for the role of a Splunk Administrator. Alerts can be used when you want to be notified of an erroneous condition in your system. For example, send an email notification to the admin when there are more than three failed login attempts in a twenty-four hour period. Another example is when you want to run the same search query every day at a  specific time to give a notification about the system status. </p> <p>Different options that are available while setting up alerts are: </p> <ul> <li> You can create a web hook, so that you can write to hipchat or github. Here, you can write an email to a group of machines with all your subject, priorities, and body of the message</li> <li> You can add results, .csv or pdf or inline with the body of the message to  make sure that the recipient understands where this alert has been fired, at  what conditions and what is the action he has taken</li>  <li> You can also create tickets and throttle alerts based on certain conditions like a machine name or an IP address. For example, if there is a virus outbreak, you do not want every alert to be triggered because it will lead to many  tickets being created in your system which will be an overload. You can control such alerts from the alert window. </li> <p>You can find more details about this topic in this blog:</p> </ul> `
    },
    {
       "command": ` Explain Workflow Actions`,
       "text": `<p>Workflow actions is one such topic that will make a presence in any set of Splunk  Interview questions. Workflow actions is not common to an average Splunk user and can be answered by only those who understand it completely. So it is important that you answer this question aptly. </p> <p>You can start explaining Workflow actions by first telling why it should be used.</p> <p>Once you have assigned rules, created reports and schedules then what? It is not the end of the road! You can create workflow actions which will automate certain tasks. For example: </p>  <ul> <li> You can do a double click, which will perform a drill down into a particular list  containing user names and their IP addresses and you can perform further search into that list</li> <li>You can do a double click to retrieve a user name from a report and then pass that as a parameter to the next report</li>  <li> You can use the workflow actions to retrieve some data and also send some  data to other fields. A use case of that is, you can pass latitude and longitude details to google maps and then you can find where an IP address or location exists. </li> </ul>  <p> The screenshot below shows the window where you can set the workflow actions.</p>`
    },
    {
       "command" : ` Explain Data Models and Pivot`,
       "text" : `<p>Data models are used for creating a structured hierarchical model of your data. It  can be used when you have a large amount of unstructured data, and when you  want to make use of that information without using complex search queries.  </p>  <p>A few use cases of Data models are:</p>  <ul>  <li><strong> Create Sales Reports:</strong> If you have a sales report, then you can easily create  the total number of successful purchases, below that you can create a child  object containing the list of failed purchases and other views</li> <li><strong> Set Access Levels:</strong>If you want a structured view of users and their various  access levels, you can use a data model  </li> <li><strong> Enable Authentication: </strong>If you want structure in the authentication, you can create a model around VPN, root access, admin access, non-root admin access, authentication on various different applications to create a structure around it in a way that normalizes the way you look at data. So when you look at a data model called authentication, it will not matter to Splunk what the source is, and from a user perspective it becomes extremely simple because as and when new data sources are added or when old one’  are deprecated, you do not have to rewrite all your searches and that is the biggest benefit of using data models and pivots.</li> </ul> <p>On the other hand with pivots, you have the flexibility to create the front views of  your results and then pick and choose the most appropriate filter for a better view of results. Both these options are useful for managers from a non-technical or semi-technical background.  You can find more details about this topic in this blog:</p> `
    },
    {
      "command" : ` Explain Search Factor (SF) & Replication Factor (RF)`,
      "text" : `<p>Questions regarding Search Factor and Replication Factor are most likely asked when you are interviewing for the role of a Splunk Architect. SF & RF are terminologies related to Clustering techniques (Search head clustering & Indexer clustering).</p> <ul> <li> The search factor determines the number of searchable copies of data maintained by the indexer cluster. The default value of search factor is 2. However, the Replication Factor in case of Indexer cluster, is the number of copies of data the cluster maintains and in case of a search head cluster, it is the minimum number of copies of each search artifact, the cluster maintains</li> <li> Search head cluster has only a Search Factor whereas an Indexer cluster has both a Search Factor and a Replication Factor</li> <li> Important point to note is that the search factor must be less than or equal to the replication factor</li> </ul> `
    },
    {
       "command" : ` Which commands are included in ‘filtering results’ category? `,
       "text" : `<p>There will be a great deal of events coming to Splunk in a short time. Thus it is a  little complicated task to search and filter data. But, thankfully there are commands  like ‘search’, ‘where’, ‘sort’ and ‘rex’ that come to the rescue. That is why, filtering  commands are also among the most commonly asked Splunk interview questions.  </p>  <p><strong>Search: </strong>The ‘search’ command is used to retrieve events from indexes or filter the  results of a previous search command in the pipeline. You can retrieve events fro  your indexes using keywords, quoted phrases, wildcards, and key/value expressions.  The ‘search’ command is implied at the beginning of any and every search operation.  </p> <p><strong>Where:</strong> The ‘where’ command however uses ‘eval’ expressions to filter search  results. While the ‘search’ command keeps only the results for which the evaluation  was successful, the ‘where’ command is used to drill down further into those search  results. For example, a ‘search’ can be used to find the total number of nodes that  are active but it is the ‘where’ command which will return a matching condition of an active node which is running a particular application.</p> <p><strong>Sort: </strong> The ‘sort’ command is used to sort the results by specified fields. It can sort the results in a reverse order, ascending or descending order. Apart from that, the sort command also has the capability to limit the results while sorting. For example, you can execute commands which will return only the top 5 revenue generating products in your business.</p> <p><strong>Rex: </strong>The ‘rex’ command basically allows you to extract data or particular fields from your events. For example if you want to identify certain fields in an email id: abc@edureka.co, the ‘rex’ command allows you to break down the results as abc being the user id, edureka.co being the domain name and edureka as the company name. You can use rex to breakdown, slice your events and parts of each of your event record the way you want.</p> `
    },
    {
       "command" : ` What is a lookup command? Differentiate between inputlookup&outputlookup commands.`,
       "text" : `<p>Lookup command is that topic into which most interview questions dive into, with questions like: Can you enrich the data? How do you enrich the raw data with external lookup? </p> <p>You will be given a use case scenario, where you have a csv file and you are asked to do lookups for certain product catalogs and asked to compare the raw data &  structured csv or json data. So you should be prepared to answer such questions  confidently. </p> <p><strong>Lookup commands</strong> are used when you want to receive some fields from an  external file (such as CSV file or any python based script) to get some value of an event. It is used to narrow the search results as it helps to reference fields in an external CSV file that match fields in your event data.</p> <p> An <strong> inputlookup</strong>  basically takes an input as the name suggests. For example, it would take the product price, product name as input and then match it with an internal field like a product id or an item id. Whereas, an <strong>outputlookup</strong> is used to generate an output from an existing field list. Basically, inputlookup is used to enrich the data and outputlookup is used to build their information.</p>  `
    },
    {
       "command" : ` What is the difference between ‘eval’, ‘stats’, ‘charts’ and ‘timecharts’ command?`,
       "text" : ` <p>‘Eval’ and ‘stats’ are among the most common as well as the most important commands within the Splunk SPL language and they are used interchangeably in the same way as ‘search’ and ‘where’ commands.</p> <ul> <li> At times ‘eval’ and ‘stats’ are used interchangeably however, there is a subtle difference between the two. While ‘stats‘ command is used for computing statistics on a set of events, ‘eval’ command allows you to create a new field altogether and then use that field in subsequent parts for searching the data. </li> <li> Another frequently asked question is the difference between ‘stats’, ‘charts’ and ‘timecharts’ commands. The difference between them is mentioned in the table below.</li>  </ul>  <table> <thead> <th>Stats</th> <th>Chart</th>  <th>TimeChart</th> </thead> <tbody> <tr> <td>Stats is a reporting command which is used to present data in a tabular format.</td>  <td>Chart displays the data in the form of a  bar, line or area graph. It also gives  the capability of generating a pie chart.</td> <td>Timechart allows y line graphs. However   possible.</td> </tr> <tr> <td>In Stats command, you can use multiple fields to build a table.  </td> <td>n Chart, it takes only 2 fields, each  field on X and Y axis respectively.</td> <td>In Timechart, it ta   the X-axis is fixed</td>  </tr>  </tbody> </table> `
    },
     {
       "command" : `What are the different types of Data Inputs in Splunk? `,
       "text" : `<p>This is the kind of question which only somebody who has worked as a Splunk administrator can answer. The answer to the question is below. </p> <ul> <li> The obvious and the easiest way would be by using files and directories as  input</li> <li> Configuring Network ports to receive inputs automatically and writing scripts such that the output of these scripts is pushed into Splunk is another  common way</li> <li> But a seasoned Splunk administrator, would be expected to add another option called windows inputs. These windows inputs are of 4 types: registry inputs monitor, printer monitor, network monitor and active directory monitor./li>  </ul> `
     },
     {
       "command" : ` What are the defaults fields for every event in Splunk?`,
       "text" : `<p>There are about 5 fields that are default and they are barcoded with every event into Splunk</p> <p>They are host, source, source type, index and timestamp.</p> `
     },
     {
       "command" : ` Explain file precedence in Splunk `,
       "text" : `<p>File precedence is an important aspect of troubleshooting in Splunk for an administrator, developer, as well as an architect. All of Splunk’s configurations are written within plain text .conf files. There can be multiple copies present for each of these files, and thus it is important to know the role these files play when a Splunk instance is running or restarted. File precedence is an important concept to understand for a number of reasons:</p> <ul> <li> To be able to plan Splunk upgrades</li> <li>  To be able to plan app upgrades  </li>  <li>  To be able to provide different data inputs and  </li>  <li>  To distribute the configurations to your splunk deployments.</li> </ul> <p>To determine the priority among copies of a configuration file, Splunk software first determines the directory scheme. The directory schemes are either a) Global or b App/user./p> <p>When the context is global (that is, where there’s no app/user context), directory priority descends in this order: </p> <ul> <li>System local directory — highest priority</li> <li>App local directories</li> <li>App default directories</li> <li>System default directory — lowest priority</li>  </ul>  <p>When the context is app/user, directory priority descends from user to app to system:</p> <ul> <li> User directories for current user — highest priority</li>  <li> App directories for currently running app (local, followed by default)</li> <li> App directories for all other apps (local, followed by default) — for exported settings only</li> <li> System directories (local, followed by default) — lowest priority</li> </ul> `
     },
     {
       "command" : `How can we extract fields?`,
       "text" : `<p>You can extract fields from either event lists, sidebar or from the settings menu via the UI.</p> <p>The other way is to write your own regular expressions in props.conf configuration file. </p>`
    
     },
     {
       "command" : ` What is the difference between Search time and Index time  field extractions?`,
       "text" : ` <p>As the name suggests, Search time field extraction refers to the fields extracted while performing searches whereas, fields extracted when the data comes to the indexer are referred to as Index time field extraction. You can set up the indexer time field extraction either at the forwarder level or at the indexer level.</p> <p>Another difference is that Search time field extraction’s extracted fields are not part of the metadata, so they do not consume disk space. Whereas index time field extraction’s extracted fields are a part of metadata and hence consume disk space. </p> `
     },
     {
       "command" : ` Explain how data ages in Splunk?  `,
       "text" : `<p>Data coming in to the indexer is stored in directories called buckets. A bucket moves through several stages as data ages: hot, warm, cold, frozen and thawed. Over time, buckets ‘roll’ from one stage to the next stage. </p> <ul>  <li> The first time when data gets indexed, it goes into a hot bucket. Hot buckets  are both searchable and are actively being written to. An index can have several hot buckets open at a time </li> <li> When certain conditions occur (for example, the hot bucket reaches a certain size or splunkd gets restarted), the hot bucket becomes a warm bucket (“rolls to warm”), and a new hot bucket is created in its place. Warm buckets are searchable, but are not actively written to. There can be many warm buckets </li> <li>Once further conditions are met (for example, the index reaches some maximum number of warm buckets), the indexer begins to roll the warm buckets to cold based on their age. It always selects the oldest warm bucket to roll to cold. Buckets continue to roll to cold as they age in this manner</li> <li> After a set period of time, cold buckets roll to frozen, at which point they are either archived or deleted.  </li> </ul> <p>The bucket aging policy, which determines when a bucket moves from one stage to the next, can be modified by editing the attributes in indexes.conf.</p>`
     },
     {
       "command" : ` What is summary index in Splunk?`,
       "text" : `<p>Summary index is another important Splunk interview question from an administrative perspective. You will be asked this question to find out if you know how to store your analytical data, reports and summaries. The answer to this question is below. </p> <p>The biggest advantage of having a summary index is that you can retain the analytics and reports even after your data has aged out. For example: </p> <ul> <li> Assume that your data retention policy is only for 6 months but, your data has aged out and is older than a few months. If you still want to do your own calculation or dig out some statistical value, then during that time, summary index is useful         </li> <li> For example, you can store the summary and statistics of the percentage growth of sale that took place in each of the last 6 months and you can pull the average revenue from that. That average value is stored inside summary index.</li> </ul> <p>But the limitations with summary index are: </p> <ul> You cannot do a needle in the haystack kind of a search </ul> <ul> You cannot drill down and find out which products contributed to the revenue</ul> <ul>  You cannot find out the top product from your statistics  </ul>  <ul> You cannot drill down and nail which was the maximum contribution to that summary. </ul> <p>That is the use of Summary indexing and in an interview, you are expected to answer both these aspects of benefit and limitation. </p> `
     },
     {
       "command" : ` How to exclude some events from being indexed by Splunk?`,
       "text" : `<p>You might not want to index all your events in Splunk instance. In that case, how  will you exclude the entry of events to Splunk.  </p> <p>An example of this is the debug messages in your application development cycle. You can exclude such debug messages by putting those events in the null queue. These null queues are put into transforms.conf at the forwarder level itself.</p> <p>If a candidate can answer this question, then he is most likely to get hired.</p> `
     },
     {
       "command" : `What is the use of Time Zone property in Splunk? When is it required the most?`,
       "text" : `<p>Time zone is extremely important when you are searching for events from a security or fraud perspective. If you search your events with the wrong time zone then you will end up not being able to find that particular event altogether. Splunk picks up the default time zone from your browser settings. The browser in turn picks up the current  time zone from the machine you are using. Splunk picks up that timezone when the data is input, and it is required the most when you are searching and correlating data coming from different sources. For example, you can search for events that came in at 4:00 PM IST, in your London data center or Singapore data center and so on. The timezone property is thus very important to correlate such events.</p>`
     },
     {
       "command" : ` What is Splunk App? What is the difference between Splunk  App and Add-on?`,
       "text" : `<p>Splunk Apps are considered to be the entire collection of reports, dashboards, alerts, field extractions and lookups. </p> <p>Splunk Apps minus the visual components of a report or a dashboard are Splunk Add-ons. Lookups, field extractions, etc are examples of Splunk Add-on.</p> <p>Any candidate knowing this answer will be the one questioned more about the developer aspects of Splunk. </p>  `
     },
     {
       "command" : `How to assign colors in a chart based on field names in  Splunk UI?`,
       "text" : `<p>You need to assign colors to charts while creating reports and presenting results. Most of the time the colors are picked by default. But what if you want to assign your own colors? For example, if your sales numbers fall below a threshold, then you  might need that chart to display the graph in red color. Then, how will you be able to  change the color in a Splunk Web UI?</p>  <p>You will have to first edit the panels built on top of a dashboard and then modify the  panel settings from the UI. You can then pick and choose the colors. You can also  write commands to choose the colors from a palette by inputting hexadecimal values  or by writing code. But, Splunk UI is the preferred way because you have the  flexibility to assign colors easily to different values based on their types in the bar chart or line chart. You can also give different gradients and set your values into a radial gauge or water gauge.</p>`
     },
     {
       "command" : ` What is sourcetype in Splunk? `,
       "text" : `<p>Now this question may feature at the bottom of the list, but that doesn’t mean it is the least important among other Splunk interview questions. </p> <p>Sourcetype is a default field which is used to identify the data structure of an incoming event. Sourcetype determines how Splunk Enterprise formats the data during the indexing process. Source type can be set at the forwarder level for indexer extraction to identify different data formats. Because the source type controls how Splunk software formats incoming data, it is important that you assign the correct source type to your data. It is important that even the indexed version of the data (the event data) also looks the way you want, with appropriate timestamps and event breaks. This facilitates easier searching of data later. </p> <p>For example, the data maybe coming in the form of a csv, such that the first line is a header, the second line is a blank line and then from the next line comes the actual data. Another example where you need to use sourcetype is if you want to break down date field into 3 different columns of a csv, each for day, month, year and then index it. Your answer to this question will be a decisive factor in you getting  recruited.</p>`
     },
     {
       "command":`What are the phases Splunk?`,
       "text":`<p>They are three phases in Splunk like First phase, second phase and third phase.</p>  <b>First phase means:</b> <p>first data is moved to forwarder</p>  <b>Second phase means:</b> <p>forwarder moved to indexer. Indexer is main heart of the  Splunk. Sorting the data, analysing the data.</p>   <b>Third phase means</b>: <p>end user run the query in search head but data will come in   indexer only.</p>  `
    },
    {
       "command":`what is Lookup in splunk?` ,
       "text":`<ul type='disc'><li>The lookup command adds fields based while looking at the value in an event, referencing a lookup table, and adding the fields in matching rows in the lookup table to your event. they are two types of lookups. <strong>Inputloolup and Outlookup</strong> </li> <li><b>For Example: | inputlookup IDC_FORD_Trend.CSV Outlookup</b> <p>is used to Writes search results to a static lookup table, or KV store collection.</p> </li> <li><b>For Example: | outputlookup IDC_FORD_Trend.CSV</b></li>  </ul>  `
    }, 
    {
       "command":`.What are the defaults fields for every event in Splunk?` , 
       "text": `There are about 5 fields that are default and they are barcoded with every event into  Splunk. They are <b>host, source, source type, index and timestamp.</b>`
    },
    {
       "command":`Which is latest splunk version in use?`,
       "text":`<p>The latest version is 8.1.1 but currently my company using 7.3.9</p>`
    },
    {
       "command":`.By Default Splunk username and password?`,
       "text":`<b>Admin</b> and <b>changeme</b>`
    },
    {
       "command":`How to change the Splunk password?`,
       "text":` <ol start='1'><li>Move the $SPLUNK_HOME/etc/passwd file to $SPLUNK_HOME/etc/passwd.bak.</li>  <li>Restart <b>Splunk</b>. After the restart you should be able to login using the default login   (admin/changeme).  splunk edit user admin -password newPassowrd -auth admin:changeme</li> </ol>`
    },
    {
       "command":`Where splunk default configuration does is stored?`,
       "text":`<p>$ cd opt/splunk/etc/system/default</p>`
    },
    {
       "command":`Who are the biggest direct competitors to Splunk?`,
       "text":`<p>logstash, Loggly, Loglogic, sumo logic etc..</p>`
    },
    {
       "command":`What is Command to enable splunk to boot start?`,
       "text":`<p>$cd opt/splunk/bin/splunk enable boot-start</p>`
    },
    {
       "command":`How to disable splunk boot start?`,
       "text":`<p>$ cd opt/splunk/bin /splunk disable boot-start</p>`
    },
    {
       "command":`What is Eval Command?`,
       "text":`<p>Strftime and strptime commands I used recently, that time I used eval command in  dashboard creation.</p>`
    },
    {
       "command":`What is fishbucket or what is fishbucket index?`,
       "text":`<b>Stats –</b> <p>This command produces summary statistics of all existing fields in your  search results and store them as values in new fields.</p>  <b>Eventstats –</b> <p>It is same as stats command except that aggregation results are  Added in order to every event and only if the aggregation is applicable to that  event. It computes the requested statistics similar to stats but aggregates them to the original raw data.</p> `
    },
    {
       "command":`Different between stats and eventstats commands?`,
       "text":`<b>Stats –</b> <p>This command produces summary statistics of all existing fields in your    search results and store them as values in new fields.</p>  <b>Eventstats –</b> <p>It is same as stats command except that aggregation results are Added in order to every event and only if the aggregation is applicable to that  event. It computes the requested statistics similar to stats but aggregates them to the original raw data.</p>`
    },
    {
       "command": `.Knowledge Objects on splunk?`,
       "text": `<p><b>I will explain the 3 main Knowledge objects: Splunk Time chart, Data models and Alert.</b></p><b>Splunk Timechart: - </b><p>The timechart command generates a table of summary\nstatistics. This table can then be formatted as a chart visualization, where your\ndata is plotted against an x-axis that is always a time field. Use the timechart\ncommand to display statistical trends over time You can split the data with another\nfield as a separate series in the chart. Timechart visualizations are usually line,\narea, or column charts.</p>\n<br/>\n<p>When you use the timechart command, the x-axis represents time. The y-axis can\nbe any other field value, count of values, or statistical calculation of a field value</p>\n<b>Example:-</b>\n<p>index=_internal \`group=thruput\` | timechart avg(instantaneous_eps) by\nprocessor</p>\n<br/>\n<br/>\n<p>\n<b>Data models:</b> you have a large amount of unstructured data which is critical to your\nbusiness, and you want an easy way out to access that information without using\ncomplex search queries. This can be done using data models as it presents your data\nin a sorted and hierarchical manner.The key benefits of data models are:</p>\n<p>Data models are a combination of multiple knowledge objects such as Lookups,\nEvent types, Field and more</p>\n<p><b>Step 1:</b> Go to Settings-&gt; Data Models.</p>\n<p><b>Step 2:</b> Click ‘New Data Model’ to create a new data model.</p>\n<p><b>Step 3:</b> Specify a ‘Title’ to your data model. You can use any character in the title,\nexcept an asterisk. The data model ‘ID’ field will get filled automatically as it is a\nunique identifier. It can only contain letters, numbers, and underscores. Spaces\nbetween characters are not allowed.</p>\n<p><b>Step 4:</b> Choose the ‘App’ you are working on currently. By default, it will be\n‘home’.</p>\n<p><b>Step 5: </b>Add a ‘Description’ to your data model.</p> <p><b>Step 6:</b> Click ‘Create’ and open the new data model in the Data Model Editor.</p> `
    },
    {
       "command": `Index-Time processingis vs. Search-Time processing?`,
       "text": `<p><b>Index-time processing</b> is the processing of data that happens before the event\n   is actually indexed. Examples of this are data fields which get extracted as and\n   when the data comes into the index like source, host and timestamp.</p>\n   <p>Following are the processes that occur during index time:</p>\n   <ol start=\`1\`>\n   <li>Default field Source type customization</li>\n   <li>Index-time field extraction</li>\n   <li>Event timestamping</li>\n   <li>Event line breaking</li>\n   <li>Event segmentation</li>\n</ol>\n<p><b>Search-time processing</b> is the processing of data that happens while a search is\nrunning. Examples of this are any kind of searches or alerts or reminders or\nlookups.</p>\n<p>Following are the processes which occur during search time:</p>\n<ol start=\`1\`>\n<li>Event segmentation (also happens at index time)</li>\n<li>Event type matching</li>\n<li>Search-time field extraction</li>\n<li>Field aliasing</li>\n<li>Field lookups from external data sources</li>\n<b>Basic Commands:</b>\n<ol start=\`1\`>\n<li>\n<b><u>Search</u> – </b>Search command in splunk is used to search for data which is stored in\nKey-Value pairs.</li>\n<li>\n<b><u>Stats –</u></b>We use stats command to gather statistics about any field or set of fields.\nThe output will always be shown in a tabular format.</li>\n<li>\n<li> <b><u>Rename</u> –</b>Rename command is use to give a field or set of fields another name.</li>\n<li><b><u>Table </u>–</b>A table command is used to show the fields in a tabular format.</li>\n<p><u>Getting started with SSPL (Splunk Search Processing Language) [5 commands\nand 3 operators]</u></p>\n<p><b>commands</b></p>\n<ol>\n<li>\nTable – Table command is use for displaying multiple field name (s).\nExample, index=\`ajeet\` sourcetype=\`csv\` |table host, sourcetype, source.\n</li>\n<li> Dedup – Dedup command is used for removing duplicate field values.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| dedup host, sourcetype, source\n| table host, sourcetype, source\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| dedup categoryId\n| table categoryId\n</li>\n<li> Search – Search command is used for searching field names. When we use\nsearch command, we are explicitly telling Splunk search Engine to only search\nfor specified field names. This way I am ensuring that my Time complexity is\nminimised.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| search categoryId=*\n| table categoryId</li>\n<li> Sort – sort command is used to sort the results in ascending or descending\norder. By default, sort command sort the results in ascending order. If we\napply a ‘-’ operator, the results gets sorted in descending order.\nExample 1, <b>index=\`ajeet\` sourcetype=\`csv\`\n| search price=*\n| sort price\n| dedup price\n| table price\nExample 2, index=\`ajeet\` sourcetype=\`csv\`\n| search price=*\n| sort - price\n| dedup price\n| table price\nExample 3, index=\`ajeet\` sourcetype=\`csv\`\n| search categoryId=*\n| sort - categoryId\n| dedup categoryId\n| table categoryId\n</b></li>\n<li> <b>Rename – </b>Rename command is used to give field another meaningful name.\nExample,<b> index=\`ajeet\` sourcetype=\`csv\`\n| search product_name=*\n| dedup product_name\n| table product_name\n| rename product_name as \`PRODUCT NAME\`</b>\n<b><u>Operators</u>-</b>\n<ol>\n<li>OR – OR is used to display one or more field values.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| search categoryId=STRATEGY OR categoryId=ARCADE\n| dedup categoryId\n| table categoryId\n</li>\n<li>AND – AND is used to display field values when all the conditions match.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| search product_name=\`Benign Space Debris\` AND categoryId=ARCADE</li>\n<li>NOT – NOT is used to exclude certain Field-value pairs.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| search categoryId=* NOT categoryId=TEE\n| dedup categoryId\n| table categoryId\n18 –May - 2019\n</li>\n\n\n</ol>\n</li>\n<li>\nStats – Stats command is used for gathering statistics based on a particular\nfield or set of fields.\nExample, index=\`ajeet\` sourcetype=\`csv\`\n| stats count by categoryId, Code, price, product_name\n29-MAY-2019\n</li>\n<li>Chart – Chart command is used to visualise the data in 2-D. Using the chart\ncommand we can group by using only 2 fields.\nExample, index=raja1\n| chart count by Code, price</li>\n\n</li>\n<li>\nTimechart – Timechart command is used to visualise the data in 2D. Using\nthe timechart command we can group by only one field.\n<b>index=raja1</b>\n<b>| timechart count by Code</b>\n<b>Aggregate Functions –</b>\n<ol start=\`1\`>\n <li>\n Sum – Sum is used to sum all the values of a specific field\n <b>\nExample, index=raja1\nprice=*\n| stats sum(price) as \`Total Sum\`</b>\n</li>\n<li>\nAvg – Avg is used to give average of all values in a particular field.\n<b>Example, index=raja1\nprice=*\n| stats avg(price) as \`Average Price\`</b>\n</li>\n<li>\nMax- Max is used to give the maximum value of a field.\n<b>Example, index=raja1\nprice=*\n| stats max(price) as \`Maximum Price\`</b>\n</li>\n<li>\nMin – Min will give minimum value of a field.\n<b>Example, index=raja1\nprice=*\n| stats min(price) as \`Minimum Price\`</b>\n<b>commands-</b>\n\n<ul type=\`none\`>\n<li>\nAddtotals – Addtotal command will give the total of a particular row.\n<b>Example, index=raja1\nprice=*\n| table price\n| addtotals\n</b>\n</li>\n<li>\nAddtotals col=t – This command will give you both the row and the column total.\n<b>Example, index=raja1\nprice=*\n| table price\n| addtotals col=t</b>\n</li>\n<li>\nAddcoltotals –Addcoltotals will give you the column total of a particular filed.\n<b>Example, index=raja1\nprice=*\n| table price\n| addcoltotals\n</b>\n</li>\n<li>\nAddcoltotals row=t – Will give both the row and column total.\n<b>Example, index=raja1\nprice=*\n| table price\n| addcoltotals row=t<b>\n</li>\n</ul>\n</li>\n<li>\n</li>\n\n</ol>\n</li>\n</ol>\n\n   `
    },
    {
       "command": `Addtotals Addcoltotals difference?`,
       "text": `<p><b>## Addtotals ##</b>\n<p>The addtotals command computes the arithmetic sum of all numeric fields for each\nsearch result\nindex=onlinestore | chart count by clientip category_id usenull=f | addtotals\nfieldname=\`Products Total\`\n</p>\n<h5>## Addcoltotals ##</h5>\n<p>The addcoltotals command appends a new result to the end of the search result set.\nThe result contains the sum of each numeric field or you can specify which fields to\nsummarize.\nindex=onlinestore | chart count by clientip category_id usenull=f | addcoltotals\nlabelfield=clientip label=\`Mytotal\`</p>`
    },
    {
       "command": `How to retrieve the top 10 values and last 10 values?`,
       "text": `<h5>### Top & Rare ###</h5>\n<p>index=onlinestore | top limit=10 category_id</p>\n<p>index=onlinestore | rare limit=10 category_id</p>`
    },
    {
       "command": `Difference between append,appendpipe and\n   appendcols?`,
       "text": `<ul type=\`square\`>\n<li>\n<a href='https://answers.splunk.com/answers/144351/what-are-the-differencesbetween-append-appendpipe.html'></a>\n</li>\n<li>\n<b>Append</b>\n<ul type=\`disc\`>\n<li>\nIf your required data present in two datasets then use subsearch to merge it\ntogether\n<li>\n<li>\nAppend is the command to merge your subsearch results to your first datasets\n</li>\n<li>\nSubsearch always run first and append the data to main query\n</li>\n<li>\nDo not use append in real time searches. Results are partial and may be inaccurate\n\n</li>\n<li>\nIt just append your subsearch result to first result set. Does not format your output\n</li>\n</ul>\n</li>\n<ul>\n<h5>Appendcols</h5>\n<p>Appends the fields of the subsearch results with the input search results.</p>\n<h5>Appendcols Specific usecase</h5>\n<p>index=\`mydata\` sourcetype=\`mydata\` | stats dc(clientip) by category_id | append [\nsearch index=\`mydata\` sourcetype=\`mydata\` | top 1 clientip by category_id] | table\ncategory_id,clientip,dc(clientip),count</p>\n<p>index=\`mydata\` sourcetype=\`mydata\` | stats dc(clientip) by category_id |\nappendcols [ search index=\`mydata\` sourcetype=\`mydata\` | top 1 clientip by\ncategory_id] | table category_id,clientip,dc(clientip),count\n<h5>Appendpipe</h5>\n<p> -Append the output of reporting commands\n - Same dataset can subject into postprocess in a single query\n - Single dataset undergoes two evaluations based on one master search</p>\n<p>index=mydata | stats count by action clientip | appendpipe [stats sum(count) as\ncount by action | eval customers= \`ALL USERS\`] | search customers=\`ALL USERS\` |\ntable action count</p>`
    },
    {
       "command": `Stats and Chart difference?`,
       "text": `<p><b>### Stats and Chart ###</b></p>\n<p>index=onlinestore | stats count by clientip category_id ---------> Tabular view</p>\n<p>index=onlinestore | chart count by clientip category_id usenull=f ----------> Matrix view</p>`
    },
    {
       "command": `Strptime and strftime examples ?`,
       "text": `<p>index=_internal | head 1 | eval str=\`2016-08-21 10:00:00\` | eval\nen=\`2016-08-21 12:00:00\` | eval start=strptime(str,\`%Y-%m-%d %H:%M:%S\`)\n| eval end=strptime(en,\`%Y-%m-%d %H:%M:%S\`) | eval duration=end-start |\ntable str en start end duration</p>\n<p>index=_internal | head 1 | eval StartTime=\`2016-08-15 10:00:00\` | eval\nRuntime=\`01:30:00\` | eval startepoch=round(strptime(StartTime,\`%Y-%m-%d\n%H:%M:%S\`)) | convert dur2sec(Runtime) as mytime | eval\nendepoch=startepoch+mytime | eval end=strftime(endepoch,\`%Y-%m-%d\n%H:%M:%S\`) | table StartTime startepoch mytime endepoch end</p>`
    },
    {
       "command": `what is data model?`,
       "text": `<p>Data model is nothing but hierarchically-structured search-time mapping of semantic\nknowledge about one or more datasets.\n</p>`
    },
    {
       "command": `.What is earliest and latest?`,
       "text": `<p><b>earliest: Specify the earliest time for the time range of your search.</b></p>\n          <p><b>latest: Specify the latest time for the time range of your search.</b></p>\n          <b>Example:</b>\n          <p>For example#1:- to start your search an hour ago, use either\n          earliest=-h (or) earliest=-60m</p>\n          <p>For example#2:-earliest=-7d@w1 latest=@w6\n          For example#3:--earliest=\`11/5/2012:20:00:00\` latest=\`11/12/2012:20:00:00\`</p>`
    },
    {
       "command": `.transaction?`,
       "text": `<p>transaction command finds transactions based on events that meet various constraints.</p>\n         <p><b>example:-</b>\n         | transaction host cookie maxspan=30s maxpause=5s\n         Top Command:-Return the top values like Return the 10 most common values for a field\n         | top limit=10 referer</p>`
    },
    {
       "command": `fillnull command?`,
       "text": `<p>Replaces null values with a specified value.</p>\n          <p>Example:\n          For the current search results, fill all empty fields with NULL.\n          | fillnull value=NULL</p>`
    },
    {
       "command": `.Head command?`,
       "text": `<p>Returns the first N number of specified results in search order.\n   <b>Example:</b>\n   |head limit=10</p>`
    },
    {
       "command": `.geostats command?`,
       "text": `<p>generate statistics to display geographic data and summarize the data on maps.\n   <b>Example:</b>\n   | geostats latfield=eventlat longfield=eventlong avg(rating) by gender</p>`
    },
    {
       "command": `.iplocation command?`,
       "text": `<p>Extracts location information from IP addresses by using 3rd-party databases.\n   <b>Example:</b>\n   sourcetype=access_* | iplocation clientip</p>`
    },
    {
       "command": `.transpose command?`,
       "text": `<p>Returns the specified number of rows (search results) as columns.\n   Example:index=_internal | stats count by sourcetype | sort -count | transpose 3\n\n   </p>\n   \n   `
    },
    {
       "command": `Join?`,
       "text": `<p>Combine the two quries. we can use join.i have queri like A,i have another query like B.i\n   want to combine both A nd B.we can use JOIN command.</p>`
    },
    {
       "command": `How to clear splunk search history?`,
       "text": `<p>Delete following file on splunk server\n   $splunk_home/var/log/splunk/searches.log</p>`
    },
    {
       "command": `What Is Dispatch Directory?`,
       "text": `<p>$SPLUNK_HOME/var/run/splunk/dispatch contains a directory for each search that is\n   running or has completed. For example, a directory named 1434308943.358 will contain\n   a CSV file of its search results, a search.log with details about the search execution, and\n   other stuff. Using the defaults (which you can override in limits.conf), these directories\n   will be deleted 10 minutes after the search completes – unless the user saves the search\n   results, in which case the results will be deleted after 7 days.</p>`
    },
    {
       "command": `How Would You Handle/troubleshoot Splunk License Violation Warning Error?`,
       "text": `<p>License violation warning means splunk has indexed more data than our purchased\nlicense quota.We have to identify which index/sourcetype has received more data\nrecently than usual daily data volume.We can check on splunk license master pool wise\navailable quota and identify the pool for which violation is occurring.g.Once we know the\npool for which we are receiving more data then we have to identify top sourcetype for\nwhich we are receiving more data than usual data.Once sourcetype is identified then we\nhave to find out source machine which is sending huge number of logs and root cause\nfor the same and troubleshoot accordingly.</p>\n    `
    },
    {
       "command": `What Is Difference Between Splunk Sdk And Splunk Framework?`,
       "text": `<p>Splunk SDKs are designed to allow you to develop applications from the ground up and\nnot require Splunk Web or any components from the Splunk App Framework. These are\nseparately licensed to you from the Splunk Software and do not alter the Splunk\nSoftware.Splunk App Framework resides within Splunk’s web server and permits you to\ncustomize the Splunk Web UI that comes with the product and develop Splunk apps\nusing the Splunk web server. It is an important part of the features and functionalities of\nSplunk Software , which does not license users to modify anything in the Splunk software.</p>\n   `
    },
    {
       "command": `.what is the difference between apps and Add-ons ?`,
       "text": `<p>Apps in splunk are full fledged Splunk artifacts - You can basically create and save all\nknowledge objects, you can also create saved searches</p>\n<p>An app is a way of localising your data and preventing people from other Application\nteams to make use of them ....</p>\n<p>Apps in Splunk can be created directly using the Splunk GUI ....\nAdd ons performs a specific set of functionalities - Like Windows and Linux Add ons for\ngetting data from Windows and Linux servers respectively ....\nAdd ons are normally imported from Splunkbase.com, a repository for splunk facilitated\napps and add ons ....</p>\n<p>Compared to apps, add ons only exhibits limited functionality and they could be grouped\nfor one to many use. Example, A Linux add on installed on Universal forwarder can only\nreceive data from Linux servers and not Windows servers</p>\n   `
    },
    {
       "command": `.How do you integrate network device logs to Splunk ?`,
       "text": `<p>Data from network devices like, Switch, Router are facilitated through either TCP or UDP\nprotocol</p>`
    },
    {
       "command": `.Index time fields are fields which are indexed at the\n   time of parsing the data in Splunk.?`,
       "text": `<p>They are stored in Memory and hence occupies space.</br>\n   Index time fields can be accessed using Tstats Command.</br>\n   Search time fields are created using Eval command in Splunk.</br>\n   They do not occupy disk space.</br>\n   These fields which show No results when you try to group them using Tstats command.</br>\n   They can only be invoked using Stats and similar commands.</p>`
    },
    {
       "command": `.What is Tsidex error?`,
       "text": `<p>This error normally occurs when _raw files are not able to be converted to Searchable\n   buckets</p>`
    },
    {
       "command": `.Explain about your roles and responsibilities in your\n   organization?`,
       "text": `<ul>\n       <li>Taking care of scheduled maintenance activities</li>\n       <li>- Creating user based knowledge objects like, Dashboards, reports, alerts, static and\n       dynamic lookups, eventtypes, doing field extractions.\n       </li>\n       <li>Troubleshooting issues related to production environment like Dashboard not showing\n       up the data - In this case we basically check from the raw logs if the format of the data\n       has changed or not.</li>\n       <li>Been part of mass password update activities for DATABASE related inputs because if\n       the DATABASE password change happens we need to change the connection password\n       created in our BBConnect application</li>\n         </ul>`
    },
    {
       "command": `Explain the Architecture of Splunk components in your\n   organization. Single site/Multi site cluster ?`,
       "text": `<p>We have a multisite cluster both at Rochelle and Hudson. Each of these clusters\n   contains 40 indexers each. Each of the cluster has 1 cluster master, 1 deployment server,\n   more than 10000 forwarders installed on clients, 1 deployment server configured to\n   receive data from forwarders - Deployment server consists of 3 kinds of apps, 7 search\n   heads in a cluster, 1 deployer</p>`
    },
    {
       "command": `Questions on Ports will be asked . Can you change the\n   default port on which splunk component runs and if yes\n   how?`,
       "text": `<p>Yes, it is configurable like this -</p>\n         <ol start='1'>\n         <li>Log into Splunk Web as the admin user</li>\n         <li>Click Settings in the top-right of the interface</li>\n         <li>Click the Server settings link in the System section of the screen.</li>\n         <li>Click General settings</li>\n         <li>Change the value for either Management port or Web port, and\n         click Save.\n         </li>\n         </ol>\n         <p>Alternatively, you can also go /bin folder and run the following command -\n         splunk set web-port newportnumber</p>\n   `
    },
    {
       "command": `Have you worked on Data Onboarding(very crucial\n   and BAU one) – What kind of data you have on boarded?\n   What process you follow while onboarding a data? Have\n   you also worked on Data normalization?`,
       "text": `<p>Yes. We need to login to the machine basically the client. If the Universal forwarder is\n   already not installed there, we need to install one. Later on we need to go to ./bin and\n   run the following command -</p>\n   <p>/splunk add monitor SOURCEFILENAME -index INDEXNAME. Example, we need to\n   monitor a file like this - /var/log/introspection/resource_usage.log. To monitor such file\n   we need to run a command like this, ./splunk add monitor</p>\n   <p>/var/log/introspection/resource_usage.log -index Ashu(Ashu is the name of the index\n   where the data will be stored).</p>\n   <p>Types of data On-boarded - Application logs, webserver logs.</p>\n   <p>Yes, I did worked on Data Normalization. Data normalization as the name states is the\nprocess of removing redundant/duplicate data, plus, it also comprises of logically\ngrouping data together.</p>\n<p>In Splunk we makes use of tags during search time to normalize data. There is one thing\nwe need to take care while normalizing data. Data normalization should only be done at\nsearch time and not index time. It is a technique which is adopted for faster data\nretrieving and lesser search execution time. So, it is better we do it once the data is\nstored in indexers.</p>\n<p>Pointer: Explain types of data we can ingest in splunk . Common ones they expect us to\nanswer is flat files(logfile, textfile etc) and syslog onboarding. You can also talk about\nDatabase and csv onboarding.</p>\n   `
    },
    {
       "command": `What are the important configs on Universal\n   forwarder . Explain them and also explain what all\n   params you define while writing them?`,
       "text": `<p>Universal forwarder doesn't have any GUI. So everything that we need to configure is by\n   logging to the UF through admin credentials. Once you login to it using this\n   path opt/splunkforwarder/bin we need to need to run following command to add\n   indexerIP/hostname where it will be forwarding data to. The command is this, ./splunk\n   add forward-server indexerIP:9997</p>\n   <p>Once this is done, we need to add sourcefile names that needs to be added. Example has\n   already been explained in #4, /splunk add monitor\n   /var/log/introspection/resource_usage.log -index Ashu</p>\n   <p>Inputs.conf - All the sourcenames added like this, /splunk add monitor\n   /var/log/introspection/resource_usage.log -index Ashu will be visible under inputs.conf\n   Outputs.conf - All the indexers name added using this path, /splunk add forward-server\n   indexerIP:9997 will be visible under outputs.conf\n   Pointers: inputs.conf , outputs.conf</p>\n   `
    },
    {
       "command": `Have you worked on Heavy forwarders ? Whats the\n   importance of it ? what are the important configurations\n   files you have on HF?`,
       "text": `<p.>Heavy forwarders are used for data pre-processing meaning it is used for selective data\n   forwarding and removing unwanted values as well.</p.\n   <p>These are the important configs of a Heavy forwarder -</p>\n   <p>When you open transforms.conf, these are the CONFIG parameters which are\nconfigurable -</p>\n<h5>DEST_KEY</h5>\n<h5>REGEX</h5>\n<h5>FORMAT</h5>`
    },
    {
       "command": `Have you worked on data transformation? For\n   example can achieve below scenarios?`,
       "text": `<h2>a. How will you mask the sensitive data before its indexed?</h2>\n   <p>Open transforms.conf and configure a SEDCMD class -\n   SEDCMD-<class> = s/<regex>/<replacement>/flags</p>\n   <p>-regex is a Perl language regular expression</p>\n  <p>-replacement is a string to replace the regular expression match.</p>\n  <p> - flags can be either the letter g to replace all matches or a number to replace a\n   specified match.</p>\n   \n   <h2>b. Can you change/replace hostname with new host ?</h2>\n  <p> Using the above class and using the replacement parameter - replacement is a string to\n   replace the regular expression match</p>\n   <h2>c. How can you filter out unwanted data from a data source and\ndrop it before it gets indexed so that I will save on licensing cost?</h2>\n<p>This is done by means of a heavy forwarder using the same configs -</p>\n<p>DEST_KEY</p>\n<p>REGEX</p>\n<p>FORMAT</p>\n\n   `
    },
    {
       "command": `How have you onboarded syslog data? Can you\n   explain that ?`,
       "text": `<p>Yes, using the unencrypted SYSLOG service and a universal forwarder. Alternatively, we\ncan also use daemon processes like, Collectd and Statsd to transmit data using UDP.</p>`
    },
    {
       "command": `Why is sourcetype and source definition so important?`,
       "text": `<p>Sourcetype is used as a data classifier whereas source contains the exact path from\n   where the data needs to be onboarded</p>`
    },
    {
       "command": `What is a license master? How does the licensing of the Splunk work? How do you create a license master and license pool?`,
       "text": `<p>License master is a Splunk instance used for monitoring Splunk data volume on a daily basis. To configure a license master:</p><p>Login to any particular indexer - Go to settings > under System > Licensing > Add License File (Mainly an XML based licensing file is added)</p>`
    },
    {
       "command": `How much data will be applicable for license cost – Is the entire data size that is being ingested or only the compressed raw data after indexed.`,
       "text": `<p>Licensing cost is calculated on the entire data size that is ingested. Compressing has nothing to with License usage; compressing is done to save on Disk space.</p>`
    },
    {
       "command": `What is the data compression ratio – Raw:Index?`,
       "text": `<p>Normally data is 38-45% compressed. We can check compressed data by running |dbinspect command.</p>`
    },
    {
       "command": `What is props.conf and transform.conf? How do you write stanzas and relate them?`,
       "text": `<p>Props.conf is a configuration file used for selective indexing - mainly used for data pre-processing. We need to mention the sourcename in the props.conf. Transforms.conf is for specifying what all set of events/parameters/fields need to be excluded. Example, DEST_KEY, REGEX, FORMAT</p>`
    },
    {
       "command": `Questions on regex will be asked – A common one would be – could you tell me the regex for IP address.?`,
       "text": `<p>Regex in Splunk is done with the help of rex, regex, and erex command. No one will ever ask you to tell regex about IP addresses.</p>`
    },
    {
       "command": `What is Deployment server used for? What is Serverclass and apps? How do you deploy base configuration (inputs, outputs.conf) from DS?`,
       "text": `<p>Deployment server is a Splunk instance used for polling from different deployment clients like, indexer, Universal forwarder, Heavy forwarder, etc. Server classes are used for grouping different servers based on the classes - like if I have to group all the UNIX based servers I can create a class called - UNIX_BASED_SERVERS and group all servers under this class. Similarly, for Windows based servers I can create a WINDOWS_BASED_SERVERS class and group all servers under this class. Apps are basically a set of stanzas which are deployed to different members of a server class.</p><p>When we set up server classes and assign them apps or set of apps we need to restart splunkd, a system-level process - Once this is done any new app updates will be automatically sent to all servers.</p>`
    },
    {
       "command": `What is Summary index? How do you create accelerated reports? Is Licensing cost applicable on Summary index?`,
       "text": `<p>Summary index contains summarized or brief data. We create accelerated reports by enabling accelerate reports option. Kindly remember that Report acceleration should only be done on data coming from the summary index, not on data coming from the application or main index. Summary index doesn't count on licensing volume.</p>`
    },
    {
       "command": `Name some default Splunk indexes and their use?`,
       "text": `<p>Main - Contains all system-related data. While adding monitor using this command - ./splunk add monitor SOURCEFILENAME if we don't mention any index name the data will automatically go into this index</p><p>_audit - All search related information - Scheduled searches as well as adhoc searches</p><p>_introspection - All system-wide data, including memory and CPU data</p><p>_internal - Error specific data. example, DATABASE connectivity hampered, etc.</p>`
    },
    {
       "command": `What do you know about Splunk CIM? What is Splunk Data normalization?`,
       "text": `CIM is common information model used by Splunk. CIM acts as a common standard used by data coming from different sources. Data normalization is already explained above`
    },
    {
       "command": `What is dispatch directory for?`,
       "text": `<p>Dispatch directory is for running all scheduled saved searches and adhoc searches.</p>`
    },
    {
       "command": `How do you check any config file consistency? (Explain Btool command)`,
       "text": `<p>Btool command shouldn't be used in most cases. It is a very unstable command and is very rarely updated. It's mainly for mainframe health check statuses. However, if we still need to run and debug things we can use this command - ./splunk btool inputs list --debug</p>`
    },
    {
       "command": `How do you configure Search Head cluster? Explain the Deployer?`,
       "text": `<p>Search head clustering is a detailed process and requires a lot of prerequisites to be in place. Here's how it is configured:</p><p><strong>PRE-REQUISITES FOR SEARCH HEAD CLUSTERING:</strong></p><ul><li>All machines must run the same OS (Need to clarify whether version difference is also important)</li><li>All members must run the same version of Splunk Enterprise</li><li>Members must be connected over a high-speed n/w</li><li>There must be at least 3 members deployed to start a SH cluster</li><li>Replication Factor ——— Replication factor must be met for all the scenarios Updates to dashboards, reports, new saved searches created are always subject to Captain - The captain takes care of all of this Before we Configure search head clustering, we need to configure a deployer because Deployer IP is required to create a search head cluster A bit about Deployer -</li></ul><h2>DEPLOYER -</h2><p>Distributes apps and other configurations to SH cluster members Can be colocated with deployment server if no. of deployment clients &lt; 50 Can be colocated with Master node Can be colocated with Monitoring console Can service only one SH cluster The cluster uses security keys to communicate/authenticate with SH members Configure a Deployer ———‘ Go to - /opt/splunk/etc/system/local and vi servers.conf After this add the below stanza - [shclustering] Pass4symmkey = password shcluster_label = cluster1 Restart the Splunk since change has been done in .conf files While setting up server classes and assign them apps or set of apps we need to restart splunkd, a system-level process - Once this is done any new app updates will be automatically sent to all servers.`
    },
    {
       "command": `What are orphaned searches and reports? How do you find them and change the owner/delete them?`,
       "text": `<p>Scheduled saved searches which are under different user names who are no more part of the Splunk ecosystem or have left the company are called orphaned searches. It happens because there is no role associated within Splunk for that particular user. With the recent upgrade of Splunk to 8.0.1, the problem with orphaned searches has almost resolved. But still, if you see the orphaned searches warning appearing under Messages in your search head you can follow this guideline on how to resolve.</p><a href='https://docs.splunk.com/Documentation/Splunk/8.0.2/Knowledge/Resolveorphanedsearches'></a>`
    },
    {
       "command": `Explain different Roles and their capabilities in Splunk?`,
       "text": `<p>User - Can only read from Splunk artifacts. Example, Reports, dashboards, alerts, and so on. Don't have edit permissions. - Power user - Can create dashboard, alerts, reports and have Edit permissions - Admin- Have access to all production servers, can do server restarts, take care of maintenance activities, and so on. Power user and normal user role are subsets of Admin role</p>`
    },
    {
       "command": `What is tstat command and how does it work? Explain what is tsidx?`,
       "text": `<p>Tstats command works on only index time fields. Like the stats commands it shows up the data in the tabular format. It is very fast compared to stats command but using tstats you can only group-by with index fields not the search time fields which are created using Eval command.</p><p>TSIDX files are Time series index files. When raw data comes to index it gets converted into Tsidx files. Tsidx files are actually searchable files from Splunk search head</p>`
    },
    {
       "command": `What are the stages of buckets in Splunk? How do you achieve data retention policy in Splunk?`,
       "text": `<p>Buckets are the directories in Splunk which stores data.</p><p>Different stages are -</p><p>- Hot Bucket - Contains newly incoming data. Once the Hot bucket size reaches a particular threshold, it gets converted to a cold bucket. This bucket is also searchable from the search head</p><p>- Warm bucket - Data rolled from hot bucket comes to this bucket. This bucket is not actively written into but is still searchable. Once the indexer reaches the maximum number of cold buckets maintained by it, it gets rolled to warm buckets</p><p>- Cold - Contains data rolled from warm buckets. The data is still searchable from the search head. It's mainly for the backup purpose in case one or more hot or warm buckets are unsearchable. After cold buckets reach a threshold, they get converted to - Frozen - Once the data is in Frozen buckets, it is either archived or deleted.</p>`
    },
    {
       "command": `License Warning ?`,
       "text": `<p>Queue and pipeline in case the daily license limit is exhausted. There will be warnings coming on the search heads that you've exceeded daily license volume and you either need to upgrade your license or stop ingesting the data.</p><p>Each and every user authenticated to Splunk has limited search quota - Normal users have around 25 MB whereas power users have around 50-125 MB. Once this threshold is exceeded for a particular time, users searches will start getting queued.</p>`
    },
    {
       "command": `Phonehome interval ? Server class ? Token ?`,
       "text": `<p>Phonehome interval is the time interval for which a particular deployment client will keep polling your Deployment server. Ex, 2 seconds ago, 10 seconds etc.</p><p>Server class are group of servers coming from the same flavour or same geographic location. Ex, to combine all windows based servers we will create a windows based server class. Similarly, to combine all Unix based servers we will create a Unix based server class.</p><p>Token is a placeholder for a set of values for a particular variable. Example, Name = $Token1$. Now here Name field can have multiple values like, Naveen, Ashu, Ajeet etc. The value that a particular token will hold completely depends upon the selection. Tokens are always enclosed between $$, like the example above.</p>`
    },
    {
       "command": `List the ways for finding if a Forwarder is not reporting to Deployment Server?`,
       "text": `<p>Check if the Forwarder host name/Ip Address is not under the blacklist panel in Deployment server.</p>`
    },
    {
       "command": `Can SF be 4 ? What data issues you have fixed ?`,
       "text": `<p>Yes search factor can be 4 if replication factor is at least 5</p>`
    },
    {
       "command": `What is throttle ? Dashboard ? 2 types of dashboards?`,
       "text": `<p>Throttling is suppressing an alert for a specific interval of time. This is normally done on each search result basis.</p><p>Dashboard is a kind of view which contains different panels and panel shows up different metrics. 2 types of dashboards - I didn't understand this question</p>`
    },
    {
       "command": `License master data has exceeded ? What will happen ?`,
       "text": `<p>If License master data has exceeded you will start seeing warnings on search head, Data ingestion will be stopped but a user will still be able to search the data.</p>`
    },
    {
       "command": `What is Data models and Pivot tables?`,
       "text": `<p>Data models are a hierarchical representation of data. It shows the data in a more structured and organized format. Pivot tables are subsets of a data model, it's an interface where users can create reports, alerts without much involvement in the SPL language.</p>`
    },
    {
       "command": `Default indexes created during Indexer installation?`,
       "text": `<p>Default indexes are - main, default, summary, _internal, _introspection, _audit</p>`
    },
    {
       "command": `How to onboard only JSON files ?`,
       "text": `<p>Set the sourcetype as JSON</p>`
    },
    {
       "command": `How splunk software handle data ?`,
       "text": `<p>It breaks raw data into a set of events. Each event is assigned 5 default values - host, source, sourcetype, timestamp, indexname</p>`
    },
    {
       "command": `Which config file will you change so that RF & SF to be same in multicluster environment ?`,
       "text": `<p>Indexes.conf</p>`
    },
    {
       "command": `How to pull Yesterday's data from DB, if server was down ?`,
       "text": `<p>If there is a connection problem between database and DBconnect in Splunk and now it has been resolved, we can run a SQL query which contains functions like, sysdate-1 if it's an ORACLE DB or to_date() function again for oracle and other DBMS.</p>`
    },
    {
       "command": `What is accelerate reports ?`,
       "text": `<p>Reports acceleration is subjected to Summary indexing. We cannot do report acceleration on data coming directly from application indexes. Report acceleration is done so that a report executes quickly on its scheduled time. It basically means to minimize the info_max_time.</p>`
    }
    ]
    const {
        listening,
        browserSupportsContinuousListening
      } = useSpeechRecognition();
      const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition({ commandss });
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({
          ...userFormData,
          [name]: value
        });
      };
 
      const [isFormValid, setIsFormValid] = useState(false);
    const commands = [
        {
            category: "HTML",
            commands: ["Head Tag", "Body Tag"]
        },
        {
            category: "CSS",
            commands: ["Media Queries", "CSS Properties", "CSS Styles"]
        },
        {
            category: "JavaScript",
            commands: ["Introduction", "Data Structures", "OOPS"]
        },
        {
            category: "React JS",
            commands: ["Class Components", "Functional Components"]
        }
    ];
    
    


    useEffect(() => {
        const userId = localStorage.getItem('userInfo');
        if (!userId) {
            navigate('/login');
        }
        if(userId){
            axios.get("https://speak-n-chat-default-rtdb.firebaseio.com/register.json")
                .then((response) => {
                const fetchedData = response.data;
                const userExisitingData = fetchedData[userId];
                console.log(fetchedData)
                setUserDataInfo(userExisitingData)
                const name = userExisitingData?.firstname;
                setuserName(name);
                
            })};

        

    }, [navigate]);
    useEffect(() => {
        // Check if each field is filled
        const valid = Object.values(userFormData).every(val => val !== '');
        setIsFormValid(valid);
    }, [userFormData]);


const handleUserInfo = () => {
        console.log(userFormData)
       
            const chatRef = ref(database, `userDataInfo${userId}`); // Assuming 'chat' is the path where you want to store chat data
            set(chatRef, { userFormData }) // Using push() to generate unique keys
                .then(() => {
                }).catch(error => {
                    console.error("Error adding data to Firebase: ", error);
                });
       
 
 
    }
    const chatRef = ref(database, `text${userId}`); // Assuming 'chat' is the path where you want to store chat data
            set(chatRef, { transcript }) // Using push() to generate unique keys
                .then(() => {
                    console.log("Added Successfully to Firebase")
                }).catch(error => {
                    console.error("Error adding data to Firebase: ", error);
                });



    // const filteredCommands = commands.filter(category =>
    //     category.category.toLowerCase().includes(searchInput.toLowerCase()) ||
    //     category.commands.some(command => command.toLowerCase().includes(searchInput.toLowerCase()))
    // );

    const filteredCommands = commandss?.filter(command => command.command.toLowerCase().includes(searchInput.toLowerCase())) || commandss

    const handleSignOut = () => {
         const user = localStorage.getItem('userInfo');
         if(user){
            localStorage.removeItem('userInfo')
            navigate("/login")
         }
    }
    const dataInfo = ref(database, `userDataInfo${userId}`); // Assuming 'chat' is the path where you want to store chat data
    set(dataInfo, { userFormData:'' }) // Using push() to generate unique keys
        .then(() => {
            console.log("cleared userDataInfo")
        }).catch(error => {
            console.error("Error adding data to Firebase: ", error);
        });
    // const handleTranscript = (e) => {
    //     setTranscript(e.target.value);
    //     resetTranscript(); // Reset the speech recognition transcript when the user manually types in the input
    //   };
    // const handleAdd = () => {
    //     const textRef = ref(database,'text');
    //     set(textRef, { yourData: text }).catch(error => {
    //       console.error("Error writing data to Firebase", error);
    //     });
    //   }
      const handleSendButton = () => {
        const chatInputData = chatInput; // Assuming you have the chat input available
    
        if(userId && chatInputData.trim() !== ""){
            const chatRef = ref(database, `data${userId}`); // Assuming 'chat' is the path where you want to store chat data
            set(chatRef, { chatInputData }) // Using push() to generate unique keys
                .then(() => {
                }).catch(error => {
                    console.error("Error adding data to Firebase: ", error);
                });
        }
    }
    // const handleSendButton = () => {
    //     const userId = localStorage.getItem('userInfo');
    //     if(userId && chatInput.trim() !== ""){
    //         axios.patch(`https://speak-n-chat-default-rtdb.firebaseio.com/register/${userId}.json`,{
    //             data: chatInput
    //         })
    //         .then(() => {
    //             console.log("Added Succesfully to Firebase")
    //         }).catch(error => {
    //             console.error("Error updating data in Firebase: ", error);
    //         });
    //     }

    // }

    const handleResetButton = () => {
        const chatRef = ref(database, `data${userId}`); // Assuming 'chat' is the path where you want to store chat data
            set(chatRef, { chatInputData:'' }) // Using push() to generate unique keys
                .then(() => {
                    setChatInput("")
                }).catch(error => {
                    console.error("Error adding data to Firebase: ", error);
                });
        // if(userId ){
        //     axios.patch(`https://speak-n-chat-default-rtdb.firebaseio.com/register/${userId}.json`,{
        //         data:null
        //     })
        //     .then(()=>{
        //         setChatInput("")
        //     }).catch(error =>{
        //         console.log("Error during reseting the button")
        //     })
        // }
    }
    const handleGenerateLink = () => {
        if (userId) {
            const url = window.location.href;
            console.log(url)
            const containsHash = url.includes('#');
            const urlMain = url.split("#")[0]
            const domain = window.location.hostname; // Get the hostname (domain name)
           let userLink
            if(containsHash){
                userLink = domain === 'localhost' ? `http://localhost:3000/mainPage#/user/${userId}` : `${urlMain}#/user/${userId}` ;

            } else{
                 userLink = domain === 'localhost' ? `http://localhost:3000/user/${userId}` : `https://${domain}/user/${userId}` ;
            }
            setUserLink(userLink);
            setGenPopUp(true);
          }
    }
    const handleClosePopup = () => {
        setGenPopUp(false);
        setLinkCopied(false)
        setIsOpen(false)
        setshowDataInfoPopup(false);
      };
      const handleCommand = (item) => {
        setChatInput(item.text)
      }
      const copyToClipboard = () => {
        navigator.clipboard.writeText(userLink)
            .then(() => {
                setLinkCopied(true)
                // Optionally, you can show a notification or update state to indicate that the link is copied
            })
            .catch((error) => {
                console.error('Error copying link to clipboard:', error);
            });
    };
    const togglePopup = () => {
        setIsOpen(!isOpen)
    }


    const handleAddCommand = () => {
        if (userId && newCommand.trim() !== '' && newAnswer.trim() !== '') {
            const commands = { ...(userDataInfo.commands || {}) };
            commands[newCommand] = newAnswer;
        
            setNewCommand('');
            setNewAnswer('');
            handleClosePopup();
        
            const updatedData = {
                ...userDataInfo,
                    commands: commands
            };
            setUserDataInfo(updatedData);
            console.log(updatedData);
        
            axios
                .patch(`https://speak-n-chat-default-rtdb.firebaseio.com/register/${userId}.json`, updatedData)
                .then(() => {
                        console.log('Command added successfully');
                })
                .catch(error => console.error('Error adding command:', error));
            

        }else{
            console.error('Both command and answer are required.');
        }
    }


    const saveTranscript = (trans) => {
        saveTranscript(trans);
        console.log(trans);
    }

    const handleUserDataInfo = () =>{
        setshowDataInfoPopup(true);
 
 
    }

    // const handleUserDataClearBtn = () => {
    //     setUserFormData({
    //         companyName: '',
    //     payroleName: '',
    //     to: '',
    //     from: '',
    //     experiences: '',
    //     experiencesRelevant: '',
    //     currentCTC: '',
    //     expectedCTC: ''
    //     })
    //     const dataInfo = ref(database, `userDataInfo${userId}`); // Assuming 'chat' is the path where you want to store chat data
    //         set(dataInfo, { userFormData:'' }) // Using push() to generate unique keys
    //             .then(() => {
    //                 console.log("cleared userDataInfo")
    //             }).catch(error => {
    //                 console.error("Error adding data to Firebase: ", error);
    //             });


    // }
    const handleUserDataClearBtn = () => {
      // Clearing the local state for user form data
      setUserFormData({
          companyName: '',
          payroleName: '',
          to: '',
          from: '',
          experiences: '',
          experiencesRelevant: '',
          currentCTC: '',
          expectedCTC: ''
      });
  
      // Instead of updating the entire user data to an empty object, only clear the specific fields in the database
      const userDataRef = ref(database, `userDataInfo${userId}`);
      set(userDataRef.child('userFormData'), {})
          .then(() => {
              console.log("Cleared userFormData in Firebase");
          })
          .catch(error => {
              console.error("Error clearing userFormData in Firebase: ", error);
          });
  }
  
   
    return (
        <div className="mainPageBackgroundContainer">
            <div className="mainPleftSectionContainer">
                <div className="logoContainer">
                <img className="logoProp" src={speakNChatLogo} alt="logo"/>
                {/* <img className='logoTextprop' src={speakNChatLogoText} alt="logoText" /> */}
                </div>
                <div className="CommandsContainer" style={{overflowY:"scroll"}}>
                    <h1 className="CommandBoxHeading">Commands</h1>
                    <div class="search-container">
                        <input type="search" placeholder="Search" class="search-input" value={searchInput}  onChange={(e) => setSearchInput(e.target.value)} />
                        <button type="button" class="search-button">
                        <BsSearch className="search-icon" />
                        </button>
                    </div>
                    {/* {filteredCommands.map((category, index) => (
                        <details key={index}>
                            <summary>{category.category}</summary>
                            <ul>
                                {category.commands.map((command, idx) => (
                                    <li key={idx}>{command}</li>
                                ))}
                            </ul>
                        </details>
                    ))} */}
                    {
                        filteredCommands?.map(item => <li style={{cursor:'pointer'}} onClick={()=>handleCommand(item)}>{item.command}</li>)
                    }
                    

                </div>
                <div className='addCommandContainer'>
                    <button onClick={togglePopup} className="addCommandButton mobileAddButton">Add</button>
                </div>

                {isOpen && 
                 <div>
                 <div className="commandsPopup" onClick={handleClosePopup}></div>
                 <div className='commandsgenerateLinkPop'>
                     <h2>Add new command</h2>
                     <div className='commandsInputContainer'>
                        
                     <label className='commandLabelText'  htmlFor="commandPrompt">Command</label>
                     <input value={newCommand} onChange={(e) => setNewCommand(e.target.value)} className='popUpInputFiled' id="commandPrompt" type="text" />
                        </div>
                        <div className='commandsInputContainer'>
                     <label className='commandLabelText' htmlFor="commandAnswer">Answer</label>
                     <input value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className='popUpInputFiled' id="commandAnswer" type="text" />
                     </div>
                     <div className='commandBtnsCont'>
                     <button onClick={handleAddCommand} className='commandCloseBtn'>Add</button>
                     <button className='commandCloseBtn' onClick={handleClosePopup}>Close</button>
                     
                     </div>
                 </div>
             </div>
                
                }
            </div>
            <div className='mainPrightSectionContainer'>
               <div className='mainPrightSectionTopBar'>
               <img className="mobilelogo" src={speakNChatLogo} alt="logo"/>
               <div className='mainPrightSectionTopBarInfo'>
                <MdPerson className='logIcon' />
                <h3 className="loginPName">{`${userName?.slice(0,1).toUpperCase()}${userName?.slice(1)}`}</h3>
                <button onClick={handleSignOut} className="signoutButton">Sign Out</button>
               </div>
               </div>

               <div className="rightSectionBottomContainer">
               <div className="MobileCommandsContainer" style={{overflowY:"scroll", height:'400px'}}>
                    <h1 className="CommandBoxHeading">Commands</h1>
                    <div class="search-container">
                        <input type="search" placeholder="Search" class="search-input" value={searchInput}  onChange={(e) => setSearchInput(e.target.value)} />
                        <button type="button" class="search-button">

                        <BsSearch className="search-icon" />
                        </button>
                    </div>
                    {/* {filteredCommands.map((category, index) => (
                        <details key={index}>
                            <summary>{category.category}</summary>
                            <ul>
                                {category.commands.map((command, idx) => (
                                    <li key={idx}>{command}</li>
                                ))}
                            </ul>
                        </details>
                    ))} */}
                    {
                        filteredCommands?.map(item => <li style={{cursor:'pointer'}} onClick={()=>handleCommand(item)}>{item.command}</li>)

                    }


                </div>
                  {/* <textarea placeholder='Mic' type="text" className='mainPtopInputContainer' value={transcript}/> */}
                  <textarea placeholder='Mic' type="text" className='mainPtopInputContainer' value={transcript} />
                  <div className="mainPbuttonsContainer">
                    <button className="startButton button" onClick={() => SpeechRecognition.startListening({
            continuous: true,
            language: "en-IN"
          })}>Start</button>
                    <button className="stopButton button"  onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className="resetButton button" 
        onClick={resetTranscript}
        
                    >Reset</button>
                  </div>

                  <textarea value={chatInput} placeholder='Chat' type="text" className='mainPbottomInputContainer' onChange={(e) => setChatInput(e.target.value)} />
                  <div className='mainPbuttonsContainer'>
                    <button onClick={handleSendButton} className='stopButton button'>Send</button>
                    <button onClick={handleResetButton} className="resetButton button">Reset</button>
                  </div>
               </div>
            <div className='generateLink'>
            <button className="generate button" 
        onClick={handleGenerateLink}
        
                    >Generate Link</button>
            <button className="userinfo button" onClick={handleUserDataInfo}>User Info</button>

            </div>
            {genPopUp && (
        <div>
        <div className="overlay" onClick={handleClosePopup}></div>
        <div className='generateLinkPop'>
            <h2>Use Below Link to see the Transcript</h2>
            <div className="linkContainer">
            <p className='userLink'>
    {userLink}
    <span className="copyIcon" onClick={copyToClipboard} title="Click here to copy">📋</span>
</p>

            </div>
            {linkCopied && <p>Link copied!</p>}
            <button onClick={handleClosePopup}>Close</button>
        </div>
    </div>
    

    
      )}
      {
            showDataInfoPopup && (
                <div>
        <div className="overlay" onClick={handleClosePopup}></div>
        <div className='userDataInfoPopupContainer'>
            <h2 className="userInfoPopUpHeading">User Info</h2>
            <div className='userInfoFromMainContainer'>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="companyName">Company Name : </label>
             <input name="companyName" className="userInfoInputField" id="companyName" onChange={handleInputChange} value={userFormData.companyName} type="text" placeholder='Enter company name' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="payroleName">Payrole Name : </label>
             <input name="payroleName" className="userInfoInputField" id="payroleName" onChange={handleInputChange} value={userFormData.payroleName} type="text" placeholder='Enter payrole name' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="toField">To : </label>
             <input name="to" className="userInfoInputField" id="toField" onChange={handleInputChange} value={userFormData.to} type="text" placeholder='To' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="fromField">From : </label>
             <input name="from" className="userInfoInputField" id="fromField" onChange={handleInputChange} value={userFormData.from} type="text" placeholder='From' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="experiecesField">Experience's : </label>
             <input name="experiences" className="userInfoInputField" id="experiecesField" onChange={handleInputChange} value={userFormData.experiences} type="text" placeholder='Experience' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="experiecesReField">Experience's relavant: </label>
             <input name="experiencesRelevant" className="userInfoInputField" id="experiecesReField" onChange={handleInputChange} value={userFormData.experiencesRelevant} type="text" placeholder='Experience relavent' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="cCTCField">Current CTC: </label>
             <input name="currentCTC" className="userInfoInputField" id="cCTCField" type="text" onChange={handleInputChange} value={userFormData.currentCTC} placeholder='Current CTC' />
             </div>
             <div className="userInfoInputLabContainer">
             <label className="userInfoLabelText" htmlFor="eCTCField">Expected CTC: </label>
             <input name="expectedCTC" className="userInfoInputField" id="eCTCField" type="text" onChange={handleInputChange} value={userFormData.expectedCTC} placeholder='Expected CTC' />
             </div>
 
 
 
            </div>
            <button disabled={!isFormValid} className='userDataInfoSaveButton' onClick={handleUserInfo}>Save</button>
            <button className="userDataInfoClosebtn" onClick={handleClosePopup}>Close</button>
            <button onClick={handleUserDataClearBtn} className="userDataInfoClearButton">Clear</button>
        </div>
    </div>
 
            )
           }
             
            </div>
            

        </div>
    )
}

export default MainPage;