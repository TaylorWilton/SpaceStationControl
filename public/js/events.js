
var occuredEvents = [];
var occuredEventsCount = 0;

function changePowerDynamic(scale) {
    // generate a random amount of change
    var changeAmount = Math.floor(Math.random() * scale) + 1;

    // get current influence
    var controllingFactionCurrentInfluence = controllingFaction["inPower"].influence;
    // figure out new influence
    var controllingFactionChangedInfluence = controllingFactionCurrentInfluence + changeAmount;
    // get number of factions
    var numFactions = factions["factions"].length;
    if (numFactions == 0) {
        controllingFaction["inPower"].influence = 100;
        station.name = "winner!";
        return
    }

    // if change would put the station over 100%
    if (controllingFaction["inPower"].influence + changeAmount > 100) {

    } else if (controllingFaction["inPower"].influence < factions["factions"][0].influence) {
        // 'controlling' is defined as having a majority of power


        var currentFaction = controllingFaction["inPower"];
        // it's sorted already
        var newFaction = factions["factions"][0];
        factions["factions"][0] = currentFaction;

        controllingFaction.$set("inPower", newFaction);

    } else {
        // everything is normal
        // change controlling faction
        controllingFaction["inPower"].influence = controllingFactionChangedInfluence;
        // dole out the change equally to everyone else
        var influenceLeft = 100 - controllingFactionChangedInfluence;
        for (var i = 0; i < numFactions; i++) {
            var change = Math.floor(influenceLeft / (numFactions - i) - Math.floor(Math.random() * scale / 2));
            influenceLeft -= change;
            factions["factions"][i].influence = change;

            if (factions["factions"][i].influence < 0) {
                factions["factions"].splice(i, 1);
                numFactions--;
            }

        }

    }

    factions["factions"] = factions["factions"].sort(function (a, b) {
        return b.influence - a.influence;
    });


}
/**
 * generates a positive event
 */
function positiveEvent() {
    $.post("../event/positive", {"occurred": occuredEvents}).done(function (data) {
        eventHandler(data);
    });
}
/**
 * effectively the same as the positive event, but bad
 */
function negativeEvent() {
    $.post("../event/negative", {"occurred": occuredEvents}).done(function (data) {
        eventHandler(data);
    });
}
function eventHandler(data) {
    occuredEvents[occuredEventsCount] = data["id"];
    occuredEventsCount++;
    var placeholders = data["placeholders"];

    // for each of the placeholders, we want to replace it
    // with the relevant data
    for (var i = 0; i < placeholders.length; i++) {
        switch (placeholders[i]) {
            case "station":
                placeholders[i] = station.name;
                break;
            case "faction":
                placeholders[i] = controllingFaction.inPower.name;
                break;
            case "commodity":
                placeholders[i] = getRandomCommodity();
                break;
            case "person":
                placeholders[i] = getRandomPerson();
                break;
            case "system":
                placeholders[i] = station.system;
                break;
            case "pirateShip":
                placeholders[i] = getRandomPirateShip();
                break;
        }
    }
    // replace the placeholder braces with actual text
    var title = data["title"].format(placeholders);
    var bodyText = data["text"].format(placeholders);
    // change power dynamics based on the event
    changePowerDynamic(data["influenceChange"]);

    var item = {"title": title, "body": bodyText, "position": occuredEventsCount};
    news["items"].unshift(item);

}