/* 
This script is to be used with Canvas Themes, to enforce fix/flex framework.  
4.11.18 -- Dale X Johnson
*/
var CourseID;
var Tabs = null;

$("a.conferences").hide(); // Remove Big Blue Conference Tool, USWA is utilizing Blackboard Collaborate & Ultra

$('#wizard_add_students').hide(); // FIXED Element - Remove wizard to add students to courses.

$('.use-as-front-page-menu-item').hide(); //FIXED Element - Remove option to set a page as the course home page.



/*
Fixed Elements Enforcement

*/
onPage(/\/courses/, function() {

    $("#choose_home_page").hide(); // FIXED Element - Remove option to choose home page

    // If user has teacher or higher access verify navigation and override if needed.
    hasAnyRole("teacher", "ta", "admin", "root_admin", function(isTeacher) {
        if (isTeacher == true) {

            var CourseSettings; // Object to hold course settings
            var isChanged = false; // Variable to determine if settings have been changed.  Used to determine if a page refresh is required.

            CourseID = getCourseId(); // Retreive the CourseID;


            // Check / Set Course HomePage 
            $.getJSON("/api/v1/courses/" + CourseID, function(result) {

                // If Homepage has been altered, update it.  Note: Changes will not be seen till the page is reloaded.
                if (result.default_view != "modules")
                    setCourseHomePage();
            });


            // Check / Set Course Announcments 
            $.getJSON("/api/v1/courses/" + CourseID + "/settings", function(result) {
                CourseSettings = result;

                // If course announcements setting don't match update them.
                if (CourseSettings.show_announcements_on_home_page != true || CourseSettings.home_page_announcement_limit != 3) {
                    {
                        setCourseSettings();
                    }
                    isChanged = true;
                }

            });




            // Check / Set Course Navigation based on Fixed / Flex Framework
            $.getJSON("/api/v1/courses/" + CourseID + "/tabs?per_page=100", function(result) {

                Tabs = result;
                // Step 1 Find Home Tab
                var homeTab = findTab(Tabs, "home");

                // Step 2: Is Home in the correct postion
                // Home tab can't be directly access, moveHomeTab moves all other tabs to enforce the Home as the top element.
                if (homeTab.position != 1) {
                    moveHomeTab(result, homeTab.position);
                    // Force Reload of Page
                    location.reload();
                }

                // Step 3: Check other tabs


                // Tabs which are set to hidden must be done first. 
                var tabx = findTab(Tabs, "discussions");
                if (tabx.hidden != true) {
                    setTabDetails("discussions", 8, "true");
                    isChanged = true;
                }

                tabx = findTab(Tabs, "people");
                if (tabx.hidden != true) {
                    setTabDetails("people", 9, "true");
                    isChanged = true;
                }


                tabx = findTab(Tabs, "pages");
                if (tabx.hidden != true) {
                    setTabDetails("pages", 10, "true");
                    isChanged = true;
                }
                tabx = findTab(Tabs, "files");
                if (tabx.hidden != true) {
                    setTabDetails("files", 11, "true");
                    isChanged = true;
                }
                tabx = findTab(Tabs, "quizzes");
                if (tabx.hidden != true) {
                    setTabDetails("quizzes", 12, "true");
                    isChanged = true;
                }
                tabx = findTab(Tabs, "modules");
                if (tabx.hidden != true) {
                    setTabDetails("modules", 13, "true");
                    isChanged = true;
                }

                tabx = findTab(Tabs, "outcomes");
                if (tabx.hidden != true) {
                    setTabDetails("modules", 14, "true");
                    isChanged = true;
                }

                tabx = findTab(Tabs, "conferences");
                if (tabx.hidden != true) {
                    setTabDetails("conferences", 14, "true");
                    isChanged = true;
                }

                // HIDDEN TABS DONE

                // FIXED TABS BEGIN


                var Syllabus = findTab(Tabs, "syllabus");
                if (Syllabus.position != 2) {
                    isChanged = true;
                    setTabDetails(Syllabus.id, 2);

                }
                var Ann = findTab(Tabs, "announcements");
                if (Ann.position != 3) {
                    isChanged = true;
                    setTabDetails(Ann.id, 3);

                }
                var assignments = findTab(Tabs, "assignments");
                if (assignments.position != 4) {
                    isChanged = true;
                    setTabDetails(assignments.id, 4);

                }
                var Grades = findTab(Tabs, "grades");
                if (Grades.position != 5) {
                    isChanged = true;
                    setTabDetails(Grades.id, 5);

                }
                var collaborations = findTab(Tabs, "collaborations");
                if (collaborations.position != 6) {
                    isChanged = true;
                    setTabDetails(collaborations.id, 6);

                }


                var Office = findTab(Tabs, "context_external_tool_7");
                if (Office.position != 7) {
                    isChanged = true;
                    setTabDetails(Office.id, 7);

                }

                // FIXED TABS COMPLETE

            });
            // If Navigation Changes occured, refresh page.
            if (isChanged == true) {
                location.reload();
            }

        }
    });

});



//// UTILITY FUNCTIONS

function findTab(tabs, id) {
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id == id)
            return tabs[i];

    }
}

function moveHomeTab(tabs, homePOS) {
    var pos = homePOS;
    for (var i = 0; i < homePOS; i++) {
        if (tabs[i].id != 'home')
            setTabDetails(tabs[i].id, pos++);

    }

}



function setTabDetails(id, Position, Hidden) {
    if (Hidden == null) Hidden = "false";

    var myURL = "/api/v1/courses/" + CourseID + "/tabs/" + id;

    var jsPromise = Promise.resolve(
        $.ajax({
            type: "PUT",
            url: myURL,
            async: false,

            data: {
                hidden: Hidden,
                position: Position
            }
        }));

    jsPromise.then(function(response, statusText, xhrObj) {

    }, function(xhrObj, textStatus, err) {
        console.log(err);
    });



}



function setCourseSettings() {


    var myURL = "/api/v1/courses/" + CourseID + "/settings";

    var jsPromise = Promise.resolve(
        $.ajax({
            type: "PUT",
            url: myURL,


            data: {
                show_announcements_on_home_page: true,
                home_page_announcement_limit: "3"

            }
        }));

    jsPromise.then(function(response, statusText, xhrObj) {

    }, function(xhrObj, textStatus, err) {
        console.log(err);
    });


}

function setCourseHomePage() {


    var myURL = "/api/v1/courses/" + CourseID;

    var jsPromise = Promise.resolve(
        $.ajax({
            type: "PUT",
            url: myURL,
            async: false,

            data: {
                default_view: "modules"

            }
        }));

    jsPromise.then(function(response, statusText, xhrObj) {

    }, function(xhrObj, textStatus, err) {
        console.log(err);
    });


}

function
getCourseId() {

    var courseId = null;
    try {
        var courseRegex = new RegExp('/courses/([0-9]+)');
        var matches = courseRegex.exec(window.location.href);
        if (matches) {
            courseId = matches[1];
        } else {
            throw new Error('Unable to detect Course ID');
        }
    } catch (e) {
        errorHandler(e);
    }
    return courseId;
}


/// Utility Functions
function onPage(regex, fn) {
    if (location.pathname.match(regex)) fn();
}

function hasAnyRole( /*roles, cb*/ ) {
    var roles = [].slice.call(arguments, 0);
    var cb = roles.pop();
    for (var i = 0; i < arguments.length; i++) {
        if (ENV.current_user_roles.indexOf(arguments[i]) !== -1) {
            return cb(true);
        }
    }
    return cb(false);
}

function onElementRendered(selector, cb, _attempts) {
    var el = $(selector);
    _attempts = ++_attempts || 1;
    if (el.length) return cb(el);
    if (_attempts == 60) return;
    setTimeout(function() {
        onElementRendered(selector, cb, _attempts);
    }, 250);
}