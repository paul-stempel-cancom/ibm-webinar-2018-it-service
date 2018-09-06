
module.exports.createIncident = function(context) {
    let incidentNumber = "INC0"+ Math.floor(Math.random() * 500);
    // bot.reply(message, `Incident wurde erstellt mit ${incidentNumber}.`);

    return {
        incidentNumber: incidentNumber
    };

    //controller.storage.users.delete(message.user);
}

module.exports.listIncidents = function(context) {
    
    // bot.reply(message, `Incident wurde erstellt mit ${incidentNumber}.`);

    return {
        incidentList: "12345 \n 67890"
    };

    //controller.storage.users.delete(message.user);
}