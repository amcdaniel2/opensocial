OpenSocial CanJS Demo
==========

## Demo

1. Open http://sandbox.opensocial2.org:8080/collabapp/index.html
2. Click Customize and click Add Embedded Experience
3. In the gadget field paste: `https://raw.github.com/amcdaniel2/opensocial/master/canjs.xml`
4. Click Add
5. Note the newly injected section in the Activity Feed

## How it works

Takes your content and wraps it in an iframe and injects all of its scripts related
to opensocial's API.  Proxy's all of the assets/json through its server to avoid
cross-domain issues.  It can pass context to the widget in the form of JSON.
Once inside the the sandbox, you can query friends and whatnot from the opensocial
javascript API.

## Resources

- http://docs.opensocial.org/display/OSREF/Embedded+Experiences+Tutorial#EmbeddedExperiencesTutorial-HowDoIGetStartedDevelopingMyOwnEmbeddedExperience%3F
- https://developers.google.com/gadgets/?hl=en
- http://code.google.com/igoogle/dashboard/?hl=en
- https://developers.google.com/gadgets/docs/fundamentals#Existing
- http://opensocial2.org:8080/collabapp/index.html
- https://sites.google.com/site/opensocialdevenv/user-guide/tutorial
- http://code.google.com/p/opensocial-jquery/