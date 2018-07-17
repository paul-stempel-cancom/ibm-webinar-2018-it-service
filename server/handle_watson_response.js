//------------------------------------------------------------------------------
// Copyright IBM Corp. 2017
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var request = require('request');
module.exports = function () {
    return {
        "handleWatsonResponse": function (bot, message, clientType) {
            let customSlackMessage = false;
            let customFacebookMessage = false;
            let actionToBeInvoked = false
            console.log(message);
            if (message.watsonError) {
                console.log(message.watsonError);
                bot.reply(message, 'Es gab einen Fehler bei der Kommunikation mit Watson!');
                return;
            }
            if (message.watsonData) {
                if (message.watsonData.context.action) {
                    actionToBeInvoked = true;
                }
            }
            if (actionToBeInvoked == true) {
                bot.reply(message, message.watsonData.output.text.join('\n'));
                invokeAction(message.watsonData, bot, message);
            }
            else {
                if (message.watsonData.output.text && message.watsonData.output.text.length > 0) {
                    //message.watsonData.output.text.forEach(function (text) {
                    //  bot.reply(message, text);
                    bot.reply(message, message.watsonData.output.text.join('\n'));
                } else {
                    bot.reply(message, 'Hier sollte ich nicht reinlaufen.')
                }
            }
        }
    }
}

    function invokeAction(watsonDataOutput, bot, message) {
        let actionName = watsonDataOutput.context.action;

        switch (actionName) {

            case 'incident.new':
                createIncident(watsonDataOutput.context, bot, message);
                break;

            default:
            bot.reply(message, "Sorry, I cannot execute what you've asked me to do");
        }
    }

    function createIncident(context, bot, message) {
        let incidentNumber = Math.floor(Math.random() * 5000);
         bot.reply(message, `Incident wurde erstellt mit ${incidentNumber}.`);
         controller.storage.users.delete(message.user);
    }

/*
module.exports = function () {
    return {
        "handleWatsonResponse": function (bot, message, clientType) {
            let customSlackMessage = false;
            let customFacebookMessage = false;
            let actionToBeInvoked = false
            console.log(message);
            if (message.watsonError) {
                console.log(message.watsonError);
                bot.reply(message, 'Es gab einen Fehler bei der Kommunikation mit Watson!');
                return;
            }
            if (message.watsonData) {
                if (message.watsonData.output) {
                    if (message.watsonData.output.context) {
                        if (message.watsonData.output.context.slack) {
                            if (clientType == 'slack') {
                                customSlackMessage = true;
                            }
                        }
                        if (message.watsonData.output.context.facebook) {
                            if (clientType == 'facebook') {
                                customFacebookMessage = true;
                            }
                        }
                    }
                }
                if (message.watsonData.context.action) {
                    actionToBeInvoked = true;
                }
            }
            if (actionToBeInvoked == true) {
                bot.reply(message, message.watsonData.output.text.join('\n'));
                invokeAction(message.watsonData, bot, message);
            }
            else {
                if (customSlackMessage == true) {
                    bot.reply(message, message.watsonData.output.context.slack);
                } else {
                    if (customFacebookMessage == true) {
                        bot.reply(message, message.watsonData.output.context.facebook);
                    }
                    else {
                        if (message.watsonData.output.text && message.watsonData.output.text.length > 0) {
                            message.watsonData.output.text.forEach(function (text) {
                                bot.reply(message, text);
                            });
                            
                        } else {
                            bot.reply(message, 'Hier sollte ich nicht reinlaufen.')
                        }
                    }
                }
            }
        }
    }
}

function invokeAction(watsonDataOutput, bot, message) {
    let actionName = watsonDataOutput.context.action;

    switch (actionName) {
        case 'incident.new':
            createIncident(watsonDataOutput.context, bot, message);
            break;
        default:
            bot.reply(message, "Sorry, I cannot execute what you've asked me to do");
    }
}

function lookupWeather(watsonDataOutput, bot, message) {
    let coordinates;
    let location = watsonDataOutput.context.action.location;

    switch (location) {
        case 'Munich':
            coordinates = '48.13/11.58';
            break;
        case 'Hamburg':
            coordinates = '53.55/9.99';
            break;
        default:
            coordinates = '52.52/13.38'; // Berlin
    }

    let weatherUsername = process.env.WEATHER_USERNAME;
    let weatherPassword = process.env.WEATHER_PASSWORD;
    let weatherUrl = 'https://' + weatherUsername + ':' + weatherPassword + '@twcservice.mybluemix.net:443/api/weather/v1/geocode/' + coordinates + '/observations.json?units=m&language=en-US';

    request(weatherUrl, function (error, response, body) {
        var info = JSON.parse(body);
        let answer = "The current temperature in " + info.observation.obs_name
            + " is " + info.observation.temp + " °C"
        bot.reply(message, answer);
    })

}
*/

