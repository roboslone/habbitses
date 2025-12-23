# Habbitses – https://roboslone.github.io/habbitses/

**Habit tracker** using your private GitHub repository as data storage.  
Operates completely in browser, except for [GitHub token exchange](https://github.com/roboslone/github-oauth-exchange).

[GitHub application](https://github.com/apps/habbitses)

## Quickstart

1. [Create](https://github.com/new?visibility=private&name=habbitses.data) a private repository:

<img width="394" height="252,5" alt="github com_new_visibility=private name=habbitses data add-readme=true description=Data+for+https___roboslone github io_habbitses_" src="https://github.com/user-attachments/assets/15412465-745f-495b-b190-eef3fb1469f8" />

2. Install Habbitses [GitHub application](https://github.com/apps/habbitses):

<img width="404,25" height="403,25" alt="github com_settings_installations_99406588" src="https://github.com/user-attachments/assets/07bf68d8-2faf-4b1a-b7db-fe4d353cc68a" />

3. Open https://roboslone.github.io/habbitses/, sign in with your GitHub account.

## Setting up your own instance

To run your own instance of Habbitses you'll need several things:

- GitHub code exchange server, you can use or fork [mine](https://github.com/roboslone/github-oauth-exchange) or write your own supporting the same [protocol](https://buf.build/roboslone-oauth/github)
- your server address and GitHub application client ID patched into `src/lib/const.ts`
- GitHub pages enabled for your repo, pushes to `main` branch are published with [GitHub workflow](https://github.com/roboslone/habbitses/blob/main/.github/workflows/deploy.yml)

If you're using my exchange server, don't forget to put it behind TLS termination proxy (e.g. `nginx`) and set up CORS to allow your domain(s).

## GitHub rate limits

All requests within Habbitses will count towards your [API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).  
At the time of writing limit is 15 000 requests per hour, so this should not be a problem.

## Security and privacy

Code exchange server **will have access** to your access and refresh tokens.

So you should only install Habbitses to a single repository containing your habit data.

App doesn't have any trackers (other than for your habits, duh) or ads and doesn't collect any data.  
However, it's technically possible for exchange server administrator to use your access token to read your repository contents and therefore your habit data, including broken habits (via git logs).

## Screenshots

<img width="292.5" height="633" alt="localhost_5173_habbitses_(iPhone 12 Pro) (1)" src="https://github.com/user-attachments/assets/fc1f49f3-c151-44d4-aed8-5d7630798ad9" />
<img width="292.5" height="633" alt="localhost_5173_habbitses_(iPhone 12 Pro) (3)" src="https://github.com/user-attachments/assets/f4bbf187-fd0e-4bd9-bdb8-373a9d61735c" />
<img width="292.5" height="633" alt="localhost_5173_habbitses_(iPhone 12 Pro)" src="https://github.com/user-attachments/assets/9d5619b3-8125-4b32-ac28-3372fb63d5aa" />
<img width="292.5" height="633" alt="localhost_5173_habbitses_(iPhone 12 Pro) (2)" src="https://github.com/user-attachments/assets/3b82a206-e9b7-4086-9236-0a85909159ea" />
