# How Cross-Origin Requests and CSRF Tokens Work

The examples below show how the browser's [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy "same-origin policy") can prevent undesired cross-origin access to resources. It's important to understand that the browser enforces this policy on browser "reads", that is, on the responses sent back from the server to the browser (although the new SameSite behaviour recently implemented in Chrome, described further down, appears to be a welcome exception that greatly improves security). 

These examples also show how an unguessable [csrf token](https://owasp.org/www-community/attacks/csrf "csrf") bound to the user's session can prevent cross-origin form submissions from succeeding (make sure to refresh the csrf token whenever the user logs back into the application). In such cases, the form is actually submitted, along with the relevant authorization cookies, but there should be no way for a third-party to access the secret csrf token or to programmatically tamper with the user's form fields (also see [clickjacking](https://en.wikipedia.org/wiki/Clickjacking#:~:text=Clickjacking%20(classified%20as%20a%20User,control%20of%20their%20computer%20while "clickjacking")).

In addition the what is shown in the examples below, when possible, it is a good idea to make cookies [secure and httponly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Creating_cookies "secure and httponly cookies") as well as [SameSite=strict](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).. Also (unrelated to this demo), remember to [sanitize web inputs](https://kevinsmith.io/sanitize-your-inputs "sanitize your inputs").

Start containers:
  * Run the "same-origin" docker container: `$ ./run.sh`
    * To view logs: `$ docker logs --follow console-logging-server`
  * Run the "cross-origin" docker container: `$ ./run.sh console-logging-server-xorigin 8000`
    * To view logs: `$ docker logs --follow console-logging-server-xorigin`

## A Basic CSRF Attack

As of this writing (November 15, 2020), a basic csrf attack, even without csrf token protection, will no longer work by default in the Chrome browser (https://www.chromium.org/updates/same-site). The screenshot below shows what happens when we try:

![CSRF Attack Fails in Chrome](chrome_does_not_allow_csrf_attack.png?raw=true "CSRF Attack Fails in Chrome")


The Chrome browser will not submit cookies via a cross-origin request by default. To support cross-origin cookie submission, the cookies must be marked with `SameSite=None` and `Secure` attributes. This basic demonstration does currently work in Firefox (version used for this example is 82.0.3), although Firefox is also apparently looking into implementing this restriction in the future. 

* To show that a normal form submission works: submit the form at `http://localhost:3000/form`
* Next, to show that an unprotected cross-origin submission works, go to `http://127.0.0.1:8000/submit_form_xorigin_no_csrf_protection.html` (note: cookies don't distinguish different ports on the same domain, so this trick prevents clobbering the original cookie produced by the legitimate interaction with localhost)
* Now, to show that a csrf token will prevent the above attack, go to `http://127.0.0.1:8000/submit_form_xorigin_with_csrf_protection.html`

Below is a screenshot showing the results from the 3 scenarios above (note that the 2 cross-origin requests that are forced when the user accesses the malicious web site on port 8000 cause the user's session cookie to be automatically submitted):

![CSRF Attack Scenarios in Firefox](firefox_allows_csrf_attack.png?raw=true "CSRF Attack Scenarios in Firefox")

## Cross-Origin Access Protections

Next, we can show some of the protections in place to prevent access to cross-origin resources. After all, if we are to rely on a csrf token to prevent csrf attacks, we need to make sure the attacker can't just get the token and proceed with the attack after all.

To demonstrate that same-origin access works, enter the following into the browser's address field (check browser console to make sure there are no errors):
  * `http://localhost:3000/load_and_submit_form_with_fetch.html`
  * `http://localhost:3000/load_form_into_iframe.html`
  * `http://localhost:3000/load_form_into_iframe_no_embedding.html`
  * `http://localhost:3000/jquery_run_and_try_to_load_source.html`  
 
To demonstrate that cross-origin access will not work, enter the following into the browser's address field (check browser console for cross-origin error messages):
  * `http://localhost:8000/load_and_submit_form_with_fetch.html`
  * `http://localhost:8000/load_form_into_iframe.html`
     * Note: We can load the form with the csrf token into the iframe, and the user can submit the form successfully. However, our javascript cannot access or modify the contents of the form
  * `http://localhost:8000/load_form_into_iframe_no_embedding.html`
     * Note: With these headers, the browser will not allow the cross-origin form to be embedded in an iframe at all
  * `http://localhost:8000/jquery_run_and_try_to_load_source.html`  
     * Note: Code in `<script>` tags can always be executed cross-origin, but we cannot inspect its source cross-origin

[wireshark](https://wireshark.org "wireshark homepage") with `http` filter can be used to show that cross-origin requests are sent to the server and the responses are returned from the server to the browser. However, if CORS is not enabled on the server, the browser will block the relevant html or js code from reading the information returned from the server. 

