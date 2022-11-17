<img src="/public/tray-logo.svg" height="48px" />

# NextJS Integration Marketplace App

A NextJS application for quickly deploying a Tray.io Native Embedded integration/automation marketplace so that your users can discover and use Tray.io Native Embedded solutions.

Features:

---

- Quickly get up and running with Tray.io Native Embedded
- Abstracts away all of the GraphQL API calls needed to provision users and create solutions
- Can be embedded in an iframe within your own product
- Simple JSON Web Token based authentication/authorization flow
- Simple JSON configuration for customising the look and feel of the marketplace
- Can be used as a template to build a more customised marketplace user experience
- Can send direct solution configuration links to users

---

## ****Getting started****

### **Deploy to vercel**

To get started, clone this repository into a private repository. We suggest using GitHub desktop to manage the files locally. Add files from this repository to the new one, commit the changes and publish the branch.

[![Create a private repo](https://cdn.loom.com/sessions/thumbnails/762ddb67d1a340c29c0ef786f1354e6b-with-play.gif)](https://www.loom.com/share/762ddb67d1a340c29c0ef786f1354e6b)

[![Clone the integration marketplace repo](https://cdn.loom.com/sessions/thumbnails/30fd747d04164e429e54748966976740-with-play.gif)](https://www.loom.com/share/30fd747d04164e429e54748966976740)

Alternatively, select fork in the upper right hand corner while viewing the repo.

You can deploy this repository directly to vercel, the NextJS hosting platform, by first navigating to vercel's dashboard [vercel's dashboard](https://vercel.com/dashboard)

[![Deploy on Vercel](https://cdn.loom.com/sessions/thumbnails/b609e88f3f9b4fd6a4e0186fe557c9e3-with-play.gif)](https://www.loom.com/share/b609e88f3f9b4fd6a4e0186fe557c9e3)

Here, create a new project, import the newly created repository. When configuring the project, add the MASTER_TOKEN in the environment variables and then deploy!

---

## ****Using the marketplace****

The goal of this application is to be integrated directly into your own product so that your users can easily take advantage of the integration library you have been building out using Tray Native Embedded.

You can either embed the application in your own product using an `<iframe>` tag, or you can forward users onto the app directly.

**The following are the steps that you need to successfully use the marketplace.**

### **1. Supply Master Token**

The only requirement for deploying the marketplace application is to supply a `MASTER_TOKEN` [environment variable](https://github.com/greg-tray/market-demo#environment-variables) as part of your deployment, which is used to verify requests which you send to the application.

You can find your Tray API master token in your account by following [these instructions](https://tray.io/documentation/embedded/getting-started/embedded-id-and-master-token/?docs_source=search&docs_term=master%20token).

### **2. Generate Verification JSON Web Token**

Using the same Tray.io API master token that you have provided to the deployed application, you should sign a [Json Web Token](https://jwt.io/) containing a user claim that can be verified by the application itself.

Each time you wish to embed the app in an iframe or forward a user to the app directly, you should sign a JSON payload with your master token. The format of the JSON payload is as follows:

### Header

```json
{
"alg": "HS256",
"typ": "JWT"
}
```

### Payload

```json
{
  // A unique identifier for your user that
  // wont change across sessions.  It can be
  // any string, but should usually correspond
  // to an id in your own product/system so that
  // you can easily find the user via our API.
  "id": "ronnieredhat@tray.io",
  // A pretty name used to identify the user in the
  // Tray dashboard UI and also for things like naming
  // user created authentications.
  "name": "Ronnie Redhat",
  // (Optional) An ISO 8601 date that indicates when the
  // token/payload should expire.  Used for extra security
  // so that json web tokens cannot be reused in the future.
  "expires": "2022-04-22T12:34:30Z",
  // (Optional) A list of tags to filter the library by
  "tagFilter": ["show", "premium"]
}
```

### Verify Signature

```jsx
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),  
	MASTER_TOKEN //Unencrypted
)
```

Make sure that you sign this JSON web token on the server side, rather than the client side, as you should make sure your master token remains private.

### **3. Embed / Forward User to the Application**

Once you have signed a JSON web token, you should then forward the user (either directly or via an iframe) to the application url, passing along the JSON web token in a `jwt` query parameter, for example:

```jsx
https://example.com/?jwt=eyJxxx.eyJxxx_xxx-xxx
```

This request will validate the JSON web token you provided and create/update the end user if necessary in your Tray account. The user can then browse and configure the solutions that you have published and all data will be persisted for the next time that you forward them to the application with a valid JSON web token.

### 4. Common Configuration Use Cases

In [/utils/config.js](https://github.com/greg-tray/market-demo/blob/main/utils/config.js) you can configure these three common settings

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| settings.windowMode | boolean | true | Launch the configuration wizard in a new popup window. If set to false, will navigate to the configuration wizard in the current iframe/page |
| settings.partnerId | Text | 'demo' | The partner ID to be used in the configuration wizard, used to load wizard CSS styles |
| settings.wizardDomain | Text | embedded.tray.io | The domain name to use for launching the configuration wizard. Can be used for white labelling the UX |

...thats all

Yep, you read right. This is all you have to do to get a Tray powered integration marketplace integrated with your own product!

---

## **Customising your deployment**

The goal of this project is to provide a lightweight, but customisable way to deploy an integration marketplace. There are a number of different configuration/customisation options available.

### ****Environment variables****
Name | Required | Description
--- | --- | ---
MASTER_TOKEN | Yes | Your Tray.io Master API token for validating JSON Web Tokens and making GraphQL API calls
GRAPHQL_ENDPOINT | No | The GraphQL endpoint to use, if you want to do a regional (EU/APAC) deployment of your marketplace

### ****Configuration****

You can configure many other aspects of the look and feel of the application by editing [/utils/config.js](https://github.com/greg-tray/market-demo/blob/main/utils/config.js).

The available configuration options are

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| color.pageBackground | CSS Color | #f6f6f6 | The general page background color |
| color.tileBackground | CSS Color | #ffffff | The background color of the solution tiles |
| color.fgColor | CSS Color | #333333 | The main font/text color of the app |
| color.highlightBgColor | CSS Color | #0068ed | The background color used for highlight buttons/controls |
| color.highlightFgColor | CSS Color | #ffffff | The foreground color used for highlight buttons/controls |
| color.successBgColor | CSS Color | #009e67 | The background color used for success buttons/controls |
| color.successFgColor | CSS Color | #ffffff | The foreground color used for success buttons/controls |
| color.dangerBgColor | CSS Color | #e52c37 | The background color used for danger buttons/controls |
| color.dangerFgColor | CSS Color | #ffffff | The foreground color used for danger buttons/controls |
| features.tags | Boolean | true | Show the solutions tags on the solution tile and allow searching/filtering by tag |
| features.image | Boolean | true | Show an image on each solution tile, based on the image custom field |
| features.tabs | Boolean | true | Show the Library/My Connections tab control on the root view |
| features.logo | Boolean | true | Show a logo, only on the individual configuration pages (for now) |
| layout.grid.columns | Number | 3 | Number of columns in the solution grid |
| layout.grid.loadingCols | Number | 9 | Number of tiles to show when loading data on the solution grid |
| layout.grid.gap | CSS Property | 24px 24px | The CSS property for the table layout gap |
| layout.image.maxWidth | CSS Size | 100% | The maximum width of a solution image |
| layout.image.maxHeight | CSS Size | 96px | the maximum height of a solution image |
| layout.image.height | CSS Size | 96px | The specific height of a solution image |
| layout.logo.maxWidth | CSS Size | 48px | The max width of the logo image |
| layout.logo.maxHeight | CSS Size | 48px | The max height of the logo image |
| content.connectCTAText | Text | Connect | The connect CTA button text |
| content.disconnectCTAText | Text | Disconnect | The disconnect CTA button text |
| content.modifyCTAText | Text | Update | The modify CTA button text |
| content.updateCTAText | Text | Edit | The update CTA button text |
| content.libraryTitle | Text | Library | The library title text, used on the library tab |
| content.connectionsTitle | Text | My Connections | The connections title text, user on the my connections tab |
| content.connectionText | Text | connection | Text for a "connection" |
| content.connectedText | Text | connected | Text for "connected" |
| content.enableText | Text | Enable | Text for "enabled" |
| content.disableText | Text | Disable | Text for "disabled" |
| content.connectSolutionMessage | Text | You have been invited to connect | Default message when a user has been invited to configure/connect a solution via a link |
| content.updateSolutionMessage | Text | Please update your connection below | Default message when a user has been given a link to modify an existing configuration/connection |
| content.connectCloseErrorMessage | Text | The connection wizard was closed before it was completed | The error message when the solution wizard is closed before completing |
| content.connectFinishedSuccessMessage | Text | Connection was successful | The message for when a solution is successfully configured |
| content.updateFinishedSuccessMessage | Text | Connection was successfully updated | The message for when a solution instance is successfully updated |
| content.disconnectFinishedSuccessMessage | Text | Connection was successfully remove | The message for when a solution instance is deleted |
| images.favicon | URL | /tray-mark.png | A URL to a browser favicon |
| images.logo | URL | /tray-mark.png | A URL to a logo |

---

## ****Advanced usage****

The application supports a number of advanced usage options.****

### ****Library and instances paths****

The default root path of the application will render a page that contains both the list of published solutions in your account alongside a tab containing all the connected solution instances for the current user. If you wish to provide your own UI/navigation system for switching between available and configured solutions, then you can use the direct application paths.

| Path | Description |
| --- | --- |
| https://example.com/?jwt=... | The default root which supports both the solution list as well as configured solution instances for the user. |
| https://example.com/library?jwt=... | Show only the library page, without the users configured solution instances |
| https://example.com/connections?jwt=... | Show only the configured solution instances page for the user |

### ****Configuration links****

Sometimes you may want to send a user directly to a particular solution to configure, rather than to the library page. This is useful if you are perhaps testing out a new solution and you want to send someone a link via email, or perhaps the solution is not public and you only want to send it to one particular user.

The marketplace application supports this by providing a dedicated solution configure/update page you can send users to, along with a couple of extra parameters in the JSON web token to verify that the user is allowed to access this solution.

### ****Configure new solution links****

To configure a new solution, use the path `https://example.com/solution/[verb]?jwt=...` (`verb` can be any word you want to describe the action of configuring, for example `configure`, `connect`, `create` etc).

You also need to add the id of the solution you want the user to configure to the JSON web token, like follows:

```json
{
  "id": "...",
  "name": "...",
  "expires": "...",
  // The uniqiue id of the solution you 
  // want the user to configure
  "solutionId": "0axxxxxx-xxxx-xxxx-918a-ab977ea16345",
  // A message you want to display for 
  // the user in the configuration UI.
  // This overrides the default config.json
  // message.
  "message": "Hello World",
}
```

### ****Update existing solution instance links****

To allow a user to re-configure or delete a solution they have already configured, use the path `https://example.com/instance/[verb]?jwt=...` (`verb` can be any word you want to describe the action of configuring, for example `reconfigure`, `reconnect`, `update` etc).

You also need to add the id of the solution instance you want the user to configure to the JSON web token, like follows:

```json
{
  "id": "...",
  "name": "...",
  "expires": "...",
  // The uniqiue id of the instance you 
  // want the user to reconfigure
  "instanceId": "0axxxxxx-xxxx-xxxx-xxxx-ab977ea16345",
  // A message you want to display for 
  // the user in the configuration UI.
  // This overrides the default config.json
  // message.
  "message": "Hello World",
}
```

### ****Solution custom fields****

There are a number of [custom fields](https://tray.io/documentation/embedded/building-integrations/displaying-solutions/) you can set on a solution which will change the user experience of those solutions within the marketplace app.

[![Solution custom fields](https://cdn.loom.com/sessions/thumbnails/714eeceb0f8b4f4f9220e221c5bb1cd1-with-play.gif)](https://www.loom.com/share/714eeceb0f8b4f4f9220e221c5bb1cd1)

Field | Type | Default | Description
--- | --- | --- | ---
image | string | No | An absolute URL to an image for that particular solution which will be displayed in the solution tile component. Requires features.image configuration to be turned on
forceUnique | yes/no, true/false | No | A flag indicating if the solution can only have a single instance created, i.e. the user should only be able to configure this solution once, not multiple times
disableAutoEnable | yes/no, true/false | No | By default all solutions will be auto enabled when they are confitured, and the only way to disable them is to delete them completely. If this is set to true, then configured solutions will have enable/disabled controls that the user can interact with, and they will not be enabled by default

---
