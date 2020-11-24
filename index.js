// invite link:
// https://discord.com/oauth2/authorize?client_id=780544377814384680&scope=bot&permissions=8
BOT_TOKEN = "";

const Discord = require("discord.js");
const client = new Discord.Client();

const createEnturService = require('@entur/sdk').default;
const service = createEnturService({clientName: "testselskap - test"});

async function _find_trips(from, to, date) {
	try {
		return await date ? service.findTrips(from, to, date) : service.findTrips(from, to);
	}
	catch (e) {
		console.log(`findTrips error: ${e}`);
	}
}

function parse_trip(trip) {
	let start_time = trip.startTime.match(/(?<=.*T).*(?=\+)/);
	let s = `Trip from \`${start_time}\` (${(trip.duration / 60).toFixed(1)} mins)`;
	s += `\nStarting from ${trip.legs[0].fromPlace.name}:`;
	for (let piece of trip.legs) {
		let dur = (piece.duration / 60).toFixed(1);
		s += `\n -> '${piece.mode}' for ${dur} mins to '${piece.toPlace.name}' \`(${piece.toPlace.latitude}, ${piece.toPlace.longitude})\``;
	}
	return s;
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag} 👌`);
});

client.on("message", m => {
	if (true) { // m.author.id == 165140141751402496
		if (res = m.content.match(/^[Ff]inn reise fra \(([\w, æÆøØåÅ]+)\) til \(([\w, æÆøØåÅ]+)\)( om [\d\.]+)?$/)) {
			let [from, to, time] = res.slice(1, 4);
			console.log(m.guild.name, m.author.tag, from, to, time);

			// if (time) { include now.utc + time in _find_trips calculation}
			(time ?
				_find_trips(from, to, new Date().getTime() + parseFloat(time.replace(" om ", ""))*60*1000) :
				find_trips(from, to)
			).then(trips => {
				if (trips) {
					m.reply(parse_trip(trips[0]));
				}
				else {
					m.reply("nò");
				}
			}).catch (r => {
				console.log(r);
				m.reply("💥");
			});
		}
	}
});

client.login(BOT_TOKEN);

/*
const express = require("express");
const app = express();
app.get("/", (req, res) => {
	_find_trips("skøyen", "majorstuen").then(trips => {
		if (trips) {
			let first = trips[0];
			res.json(parse_trip(first));
		}
		else {
			res.sendStatus(400);
		}
	}).catch (r => {res.status(500).send(String(r));});
});

app.listen(8080, () => {
	console.log("Listening");
});*/
