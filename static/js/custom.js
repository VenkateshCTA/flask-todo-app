janrain.settings.capture = janrain.settings.capture || {}
janrain.settings.capture.beforeJanrainCaptureWidgetOnLoad = janrain.settings.capture.beforeJanrainCaptureWidgetOnLoad || []
janrain.settings.capture.beforeJanrainCaptureWidgetOnLoad.push(function() {
    janrain.events.onCaptureRenderComplete.addHandler(function(event) {

            document.title = "Globe Login";
            console.log("event.screen: " + event.screen);

            var ExternalLoginURL = document.URL.indexOf("logindev") >= 0 ? "https://wwwstage.globe.com.ph/globeone" : "https://www.globe.com.ph/globeone";

            if (event.screen == "resetPasswordRequestSuccess") {
                var screen = document.getElementById("resetPasswordRequestSuccess")
                var emailAddress;

                if( document.body.contains(document.getElementById('capture_resetPasswordRequest_signInEmailAddress')) ){
                    if(document.getElementById("capture_resetPasswordRequest_signInEmailAddress").value != "" ){
                        emailAddress = document.getElementById("capture_resetPasswordRequest_signInEmailAddress").value;
                    }
                }
                if( emailAddress == null && document.body.contains(document.getElementById('capture_resetPasswordCodeExchange_signInEmailAddress'))){
                    if(document.getElementById("capture_resetPasswordCodeExchange_signInEmailAddress").value != "" ){
                        emailAddress = document.getElementById("capture_resetPasswordCodeExchange_signInEmailAddress").value;
                    }
                }
                console.log("resetPasswordRequestSuccess.emailAddress: "+emailAddress);

                screen.innerHTML = screen.innerHTML.replace("{forgot_password_email}", emailAddress);

                screen.childNodes[1].childNodes[1].childNodes[0].nodeValue = "Please check your email";

                var email = document.getElementById("capture_resetPasswordCodeExchange_resetPasswordRequestForm").elements[0].value;
                document.querySelector(".screen-description").innerHTML = "We've sent the email to " +email+ ". Please click the link in the email to reset your password. Remember to check your spam folder as well.";

            }

            if (event.screen == "resetPassword") {
                var reset_note = document.createElement('span');
                reset_note.classList.add("reset-note");
                var ref = document.querySelector('#resetPassword h1.screen-heading');
                insertAfter(reset_note, ref);
                reset_note.innerHTML = "You should create a strong password that is at least 9 alphanumeric characters, with uppercase and lowercase letters, and a special character.";
            }

            if (event.screen == "verifyEmail") {
                var screen3 = document.getElementById("verifyEmail")
                screen3.childNodes[1].childNodes[1].childNodes[0].nodeValue = "Invalid email verification link";

                var success_check = document.createElement('span');
                success_check.classList.add("success-check");
                var ref = document.querySelector('#verifyEmail h1.screen-heading');
                insertAfter(success_check, ref);

                //--Change Sign-in Link
                var sign_in_link = document.getElementById("capture_verifyEmail_linkHelp")
                sign_in_link.removeAttribute("data-capturefield");
                sign_in_link.href = ExternalLoginURL;
                sign_in_link.target = "_self";


                //--change icon
                var textdesc = document.querySelector('#verifyEmail .auth-screen .screen-description').textContent;
                if( textdesc.indexOf("expired") >= 0 ){
                    document.querySelector('#verifyEmail .success-check').style = "display:none";

                    var warning_icon = document.createElement('span');
                    warning_icon.classList.add("warning-icon");
                    var ref = document.querySelector('#verifyEmail h1.screen-heading');
                    insertAfter(warning_icon, ref);
                }
            }

            if (event.screen == "authRule_verifyEmail") {
                var screen = document.getElementById("authRule_verifyEmail")
                screen.innerHTML = screen.innerHTML.replace("{verify_email}",
                document.getElementById("capture_authRule_verifyEmail_readOnlyEmailAddress").value);

                /**** Verify your Email spiels customization */
                document.querySelector("#authRule_verifyEmail .auth-screen .screen-heading").innerHTML = "Please verify your email";
                var user_email = document.getElementById("capture_authRule_verifyEmail_readOnlyEmailAddress").value;
                var verify_note = "Just one more step...<br />Please click the link in the email we sent to <strong>" + user_email + "</strong> to verify your email. Don't forget to check your spam folder. <br /><br />Didn't receive our email?";
                document.querySelector("#authRule_verifyEmail .auth-screen .screen-description").innerHTML = verify_note;
                //--TBD if this needs to be hide #capture_authRule_verifyEmail_form_item_readOnlyEmailAddress


            }
            if (event.screen == "resetPasswordRequest") {
                var resetEmail = document.getElementById("capture_resetPasswordRequest_resetPasswordRequestForm");
                resetEmail.addEventListener("focusin", inputFocus);

                function inputFocus() {
                    document.getElementById("capture_resetPasswordRequest_resetPasswordRequestForm_errorMessages").style.visibility = "hidden";
                }
            }

            /***** Multiple Password Eye Toggle */
            function togglePassword(eyeToogleID, input_password) {
                return function() {
                    var x = document.getElementById(input_password);
                    if (x.type === "password") {
                        x.type = "text";
                        document.getElementById(eyeToogleID).classList.remove("eye-close");
                        document.getElementById(eyeToogleID).classList.toggle("eye-open");
                    } else {
                        x.type = "password";
                        document.getElementById(eyeToogleID).classList.remove("eye-open");
                        document.getElementById(eyeToogleID).classList.toggle("eye-close");
                    }
                };
            }

            function OnBlurFixTogglePassword(eyeToogleID, input_password) {
                return function() {
                    var x = document.getElementById(input_password);
                    if (x.type === "password") {
                        document.getElementById(eyeToogleID).classList.remove("eye-open");
                        document.getElementById(eyeToogleID).classList.toggle("eye-close");
                    } else {
                        document.getElementById(eyeToogleID).classList.remove("eye-close");
                        document.getElementById(eyeToogleID).classList.toggle("eye-open");
                    }
                };
            }


            passwordsEle = document.querySelectorAll(".capture_password");

            for (var i = 0; i < passwordsEle.length; i++) {
                var pwdID = passwordsEle[i].getAttribute("id");
                var input_password = document.querySelector("#" + pwdID + " input[type=password]").getAttribute("id");
                var eyeToogle = document.createElement("span");
                var eyeToogleID = "eyeToogle" + (i + 1);

                eyeToogle.classList.add("toggle-password");
                eyeToogle.classList.add("eye-icon");
                eyeToogle.classList.add("eye-close");
                eyeToogle.setAttribute("id", eyeToogleID);

                var currentpass_ele = document.getElementById(pwdID);
                currentpass_ele.appendChild(eyeToogle);
                eyeToogle.addEventListener("click", togglePassword(eyeToogleID, input_password));

                //--Add input OnFocus event
                document.querySelector("#" + input_password).addEventListener("focus", OnBlurFixTogglePassword(eyeToogleID, input_password), true);

            }

            /**** Modify screen description / Important Reminder */
            document.querySelector(".auth-screen .screen-description").innerHTML = "<span class=\"note-header\">Important Reminder:</span> Due to the recent system upgrade. Please nominate a new password in <a href=\"#\" class=\"aic-control\" data-render-screen=\"resetPasswordRequest\">forgot your password?</a> option.";


            /**** Add "OR" label on hr separator */
            function insertAfter(el, referenceNode) {
                referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
            }

            var hrOR = document.createElement('span');
            hrOR.classList.add("hr-or");
            hrOR.innerHTML = "or";

            if( document.body.contains(document.querySelector('#signIn .social-signin')) ){
                var ref = document.querySelector('#signIn .social-signin');
                insertAfter(hrOR, ref);
            }


            /**--END **/

            if (event.screen == "traditionalRegistration") {
                /**** Create Account - Add "OR" label on hr separator */
                var ref_tr = document.querySelector('#traditionalRegistration .social-signin');
                insertAfter(hrOR, ref_tr);
            }

            /**** Inject TOC before reset password button */
            function AppendTermsOfService(ButtonLabel, EleRef) {
                var TOC = "By tapping \"" + ButtonLabel + "\", you agree to our <a id=\"capture_traditionalRegistration_linkTermsOfService\" target=\"_blank\" class=\"capture_linkTermsOfService\" data-capturefield=\"linkTermsOfService\" href=\"https://www.globe.com.ph/website-terms-conditions.html\" name=\"linkTermsOfService\">Terms of Service</a>";
                TOC += " and <a id=\"capture_traditionalRegistration_linkPrivacyPolicy\" target=\"_blank\" class=\"capture_linkPrivacyPolicy\" data-capturefield=\"linkPrivacyPolicy\" href=\"https://www.globe.com.ph/privacy-policy.html\" name=\"linkPrivacyPolicy\">Privacy Policy</a>.";

                var pdesc = document.createElement('p');
                pdesc.classList.add("registration-acceptance");
                pdesc.innerHTML = TOC;

                insertAfter(pdesc, ref);
            }

            if (event.screen == "resetPasswordRequest") {
                var ref = document.querySelector('#capture_resetPasswordRequest_form_item_signInEmailAddress');
                AppendTermsOfService("RESET PASSWORD", ref);
            }

            /*** Insert check icon on success screen */
            if (event.screen == "resetPasswordSuccess") {
                var success_check = document.createElement('span');
                success_check.classList.add("success-check");
                var ref = document.querySelector('#resetPasswordSuccess h1.screen-heading');
                insertAfter(success_check, ref);


                //--Insert if Browser doesn;t automatically redirect
                //-removed as per cxd 080719
                //var redirect_note = "If your browser doesn't automatically redirect in a few seconds, just";
                //redirect_note += '<a id="capture_resetPasswordSuccess_linkHelp" class="capture_linkHelp" data-capturefield="linkHelp" href="#" name="linkHelp"> click here to continue to sign_in</a>';

                //document.querySelector('#resetPasswordSuccess .help-link').innerHTML = redirect_note;
            }

            if (event.screen == "verifyEmailSuccess") {
                var success_check = document.createElement('span');
                success_check.classList.add("success-check");
                var ref = document.querySelector('#verifyEmailSuccess h1.screen-heading');
                insertAfter(success_check, ref);

                //--Insert "Redirecting you in a few seconds..."
                var redirecting_status = document.createElement('div');
                redirecting_status.classList.add("redirecting-status");
                redirecting_status.innerHTML = "Redirecting you in a few seconds...";
                var ref = document.querySelector('#verifyEmailSuccess .success-check');
                insertAfter(redirecting_status, ref);


                //--Insert if Browser doesn;t automatically redirect
                //-removed as per cxd 080719
                //var redirect_note = "If your browser doesn't automatically redirect in a few seconds, just";
                //redirect_note += '<a id="capture_resetPasswordSuccess_linkHelp" class="capture_linkHelp" data-capturefield="linkHelp" href="#" name="linkHelp"> click here to continue to sign_in</a>';

                //document.querySelector('#verifyEmailSuccess .help-link').innerHTML = redirect_note;
            }


            //--Create Account via 3rdParty(social login)
            if (event.screen == "socialRegistration") {
                //--disable email input
                var captureEmail = document.getElementById("capture_socialRegistration_emailAddress");
                if (captureEmail.value != "") {
                    captureEmail.setAttribute("readonly", "readonly");
                }

                document.querySelector('#socialRegistration h1.screen-heading').innerHTML = "Complete your sign in";
                document.querySelector('#socialRegistration button.register-button').innerHTML = "Continue";

            }

            if (event.screen == "visitingMessage") {
                var sign_in_link = document.getElementById("capture_visitingMessage_linkHelp")
                sign_in_link.removeAttribute("data-capturefield");
                sign_in_link.href = ExternalLoginURL;
                sign_in_link.target = "_self";

                var notes = "Our website uses cookies to help enhance your browsing experience. Continue to browse our site if you agree to our use of cookies as described in ";
                notes += '<a id="capture_traditionalRegistration_linkTermsOfService" target="_blank" class="capture_linkTermsOfService" href="https://www.globe.com.ph/cookie-policy.html" name="linkGlobeCookiePolicy">Globe\'s Cookie Policy</a>. ';
                notes += 'Otherwise, you may change your <a id="capture_traditionalRegistration_linkTermsOfService" target="_blank" class="capture_linkTermsOfService" href="https://www.globe.com.ph/cookie-policy.html#cookiesettings" name="linkCookieSettings">cookie settings</a>. ';
                notes += 'For information on how we protect your privacy, please read our <a id="capture_traditionalRegistration_linkPrivacyPolicy" target="_blank" class="capture_linkPrivacyPolicy" data-capturefield="linkPrivacyPolicy" href="https://www.globe.com.ph/privacy-policy.html" name="linkPrivacyPolicy">Privacy Policy</a></p>';

                var p_notes_ele = document.createElement('p');
                p_notes_ele.classList.add("notes");
                p_notes_ele.innerHTML = notes;

                var ref = document.querySelector('#visitingMessage .screen-description');
                insertAfter(p_notes_ele, ref);

            }

            /*Fix tooltip text on social buttons*/
            setTimeout(function() { //<--wait for buttons to be render
                if (document.querySelector('.social-provider.googleplus')) {
                    document.querySelector('.social-provider.googleplus').setAttribute("title", "Google");
                }
                if (document.querySelector('.social-provider.facebook')) {
                    document.querySelector('.social-provider.facebook').setAttribute("title", "Facebook");
                }
                if (document.querySelector('.social-provider.yahoo-oauth2')) {
                    document.querySelector('.social-provider.yahoo-oauth2').setAttribute("title", "Yahoo!");
                    /*document.querySelector('.social-provider.yahoo-oauth2 .provider-name').textContent = "Yahoo!";*/
                }
            }, 2000);


            if (event.screen == "resetPasswordCodeExchange") {
                var textdesc = document.querySelector('#resetPasswordCodeExchange .auth-screen .screen-description').textContent;
                if( textdesc.indexOf("recognize") >= 0 ){
                    document.querySelector('#resetPasswordCodeExchange .auth-screen .screen-heading').innerHTML = "Expired reset password link";
                }

                //--modify back to login link
                var backLink = document.querySelector("#resetPasswordCodeExchange .help-link").lastChild;
                backLink.textContent= "Go to sign in to create an account";
                backLink.href = ExternalLoginURL;
                backLink.target = "_self";

                var backLinkCloned = backLink.cloneNode(true);
                document.querySelector("#resetPasswordCodeExchange .help-link").textContent = "";
                document.querySelector("#resetPasswordCodeExchange .help-link").appendChild(backLinkCloned);

            }

            if (event.screen == "traditionalAuthenticateMerge") {
                //--Back to Login URL
                var backLink = document.querySelector("#traditionalAuthenticateMerge .help-link").lastChild;
                backLink.textContent= "Go back to login and reset my password";
                backLink.href = ExternalLoginURL;
                backLink.target = "_self";

                var backLinkCloned = backLink.cloneNode(true);
                document.querySelector("#traditionalAuthenticateMerge .help-link").textContent = "";
                document.querySelector("#traditionalAuthenticateMerge .help-link").appendChild(backLinkCloned);

                //--disable email input
                var captureEmail = document.getElementById("capture_traditionalAuthenticateMerge_signInEmailAddress");
                if (captureEmail.value != "") {
                    captureEmail.setAttribute("readonly", "readonly");
                }
            }

            if (event.screen == "mergeAccounts") {
                //-fix 'yahoo!' class name, add proper ".yahoo" classname
                var icons = document.querySelectorAll('#mergeAccounts .social-provider-icon')
                for (var i = 0; i < icons.length; i++) {
                    if( icons[i].getAttribute("class").indexOf("yahoo!") >= 0 ){
                            icons[i].classList.add("yahoo");
                    }
                }
            }





    }) //--/end of onCaptureRenderComplete

}) //-- /end of beforeJanrainCaptureWidgetOnLoad
