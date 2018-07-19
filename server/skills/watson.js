var incidents = require('../services/incidents.js')

async function handleWatsonResponseAsync(bot, message, clientType, middelware) {
    // let customSlackMessage = false;
    // let customFacebookMessage = false;
    let actionToBeInvoked = false
    //console.log(message);

    if (message.watsonError) {
        console.log(message.watsonError);
        bot.reply(message, 'Es gab leider einen Fehler bei der Kommunikation mit Watson.');
        return;
    }

    if(message.watsonData.context) {
        console.log(message.watsonData.context);
    }

    let context = message.watsonData.context || {};

    if (context.action_name) {
        // bot.reply(message, message.watsonData.output.text.join('\n'));
        // invokeAction(message.watsonData, bot, message);
        if (!invokeAction(context)) {
            bot.reply(message, 'Ich konnte diese Aktion leider nicht ausführen.')
        } else {
            await middelware.updateContextAsync(message.user, context);
        }
    }    

    if (message.watsonData.output.text && message.watsonData.output.text.length > 0) {
        //message.watsonData.output.text.forEach(function (text) {
        //  bot.reply(message, text);
        let text = message.watsonData.output.text.join('\n');

        if (context.result) {
            for(var property in context.result) {
                text = text.replace(`{${property}}`, context.result.incidentNumber);
            }           
        }

        bot.reply(message, text);
    } else {
        bot.reply(message, 'Hier sollte ich nicht reinlaufen.')
    }
};

function invokeAction(context) {
    switch (context.action_name) {
        case 'incident.new':
            context.result = incidents.createIncident(context);
            deleteActionVariables(context);
            return true;
        default:
            console.log("action is unknown", context.action_name);
            return false;
    }    
}


/**
 * Delete any property that starts with "action_" 
 */
function deleteActionVariables(context) {
    for (var property in context) {
        if (context.hasOwnProperty(property)) {
            if(property.startsWith("action_")) {
                delete context[property];
            }
        }
    }
}

// function invokeAction(watsonDataOutput, bot, message) {
//     let actionName = watsonDataOutput.context.action;

//     switch (actionName) {
//         case 'incident.new':
//             incidents.createIncident(watsonDataOutput.context, bot, message);
//             break;

//         default:
//             bot.reply(message, "Es tut mir leid. Diese Aktion kenne ich nicht.");
//     }
// }

module.exports = function (controller) {

    var middleware = require('botkit-middleware-watson')({
        username: process.env.CONVERSATION_USERNAME,
        password: process.env.CONVERSATION_PASSWORD,
        workspace_id: process.env.WORKSPACE_ID,
        url: process.env.WORKSPACE_URL,
        version_date: '2018-07-10'
    });

    controller.on('direct_message,direct_mention,mention,interactive_message_callback,message_received', function (bot, message) {
        middleware.interpret(bot, message, function (err) {
            if (!err) {
                handleWatsonResponseAsync(bot, message, 'web', middleware).catch(function(err) {
                    console.log(err);
                 });
            } else {
                console.log('interpretation with watson failed', err)
                bot.reply(message, "Es tut uns leid. Aufgrund von technischen Problemen kann ich nicht auf Ihre Nachricht antworten.");
            }
        });
    });
};



