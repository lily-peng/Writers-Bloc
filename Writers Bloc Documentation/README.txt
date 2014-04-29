README: Final Delivery

The root directory of the repo contains three files (WritersBloc.css, WritersBloc.html, WritersBloc.js) that form a standard Meteor project. There is no final executable or installable product, but rather source is deployed using Meteor, the final product being visible on the website that you have deployed to. We have already deployed the site to writersbloc.meteor.com, but if you wish to deploy yourself, follow these instructions.


NOTE: While you can view our site on any platform, you will need to be using Linux/Mac to deploy the site yourself. There exists a Windows port, but as of this writing it’s a bit buggy and you’d probably be better off using a VM.

1. Download the source at our repo (you’ve already done this!)

2. Install Meteor (follow directions at https://www.meteor.com)

3. Go to Terminal

4. >“meteor create writers-bloc”
	This will create a folder in the current directory.

5. >cd writers-bloc

6. Insert all files from the repo into this directory.

7. >meteor (localhost:3000)
	This will deploy the app locally. Go to localhost:3000 on the bowser of your choice to test. If you wish to deploy to the Internet, follow the next step.

8. > meteor deploy www.<Name of Choice Here>.meteor.com
	This will deploy to Meteor’s site. The app will be hosted at this URL until prolonged inactivity, after which you will have to deploy again.


All documentation from the second half of the course, including the Development Documentation, can be found in the Documentation folder.



