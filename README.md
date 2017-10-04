<p><a href="http://liquid-ui.com/kb" target="_blank"><img src="http://www.liquid-ui.com/images/liquid_logo_saperp_registered_3.png" alt="WS logo" style="max-width:100%;" height="70"></a></p> <h1>WebScript Programming Language</h1>

<p><strong>Welcome to WebScript!</strong></p> <p>WebScript (WS) is a JavaScript-based scripting language for SAP customization. It enables you to optimize and streamline SAP without having to rebuild the whole transaction while preserving transaction richness.</p> <p>WS core features include object structures, functions, and human-readable syntaxes. Every generated scripts by default are scalable, memory safe and can be easily extended to the mobile environment.</p> 

<h2>Downloading from OpenWS</h2>
<p>This repository is filled with different solutions and demos for all types of business processes in SAP.</p>
<p>To try any of these scripts out, you must have <a href = "http://liquid-ui.com/products/liquid_ui_sapgui.php">Liquid UI for SAP GUI</a>. If you are interested in a trial version, please call +1.650.341.3310 or email us at rfi@guixt.com.</p>

<h3>Using the Github Interface</h3>
<p>Click on the module you would like to download and a list of files will be presented. Through the Github website, you can download each file one at a time.</p>

<p>Click on the file you want to download. On the top right, click the "Raw" button. Lastly, right click on the webpage and click Save As to save the file with whatever name you'd like. Once you have downloaded all the files for the module, set your script directory, in the guixt.sjs configuration file, to point the the newly downloaded scripts and try them out.</p>

<h3>Using the SAP GUI Interface</h3>
<p>Not familiar with Github? No problem, we have developed a SAP GUI interface! This will allow you to download modules with one click from within SAP GUI. You can even activate the modules immediately after they are download to try them out. All you need are three files (init_OpenWS.sjs, wscurl.dll, wsoffice.dll). Email us at support@guixt.com and we will give the files and help you get set up.</p>

<h2>Contributing to OpenWS</h2>
<p>To be a truly great community, Liquid UI welcomes its developers with different experiences. We believe a diverse and friendly community will have more great ideas, more unique perspectives, and produce more great code. Therefore, contributions to OpenWS are welcomed and encouraged! We will work diligently to make the Liquid UI community welcoming to everyone.</p> 

<p>To upload your own module to OpenWS, zip up your scripts folder and email us at support@guixt.com with the attachment. These scripts will be reviewd by one of our Support Engineers to ensure they are up to Liquid UI's standards. The module can be a current solution your company is using, a solution you have developed just for fun, or even just some demo screens, illustrating the possibilities of Liquid UI WS.</p>

<h3>FileList.JSON</h3>
<p>One important file to include in your zipped script folder is <strong>FileList.JSON</strong></p>
<p>This file has all the total files in the script folder listed out in a JSON object. All our modules contain this file, below is an example:</p>

```javascript
[
  {"name":"SAPLSMTR_NAVIGATION.E0100.sjs"},
  {"name":"SAPLSMTR_NAVIGATION.E0101.sjs"},
  {"name":"SAPMV45A.E4001.sjs"},
  {"name":"CompanyLogo.png"}
]
```

<h3>Preview.PNG</h3>
<p>Want to show a preview of what your solution looks like? Include a <strong>Preview.PNG</strong> file in your zipped script folder. This can be very helpful for a developer to get an idea of what your solution should look like without having to download the files.</p>
