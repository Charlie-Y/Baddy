mve = require('./mve_base')

ls = window.localStorage

MVE_Storage = {

	# Returns plain JS objects by videoId
	getMovementsRaw: (videoId) ->
		result = JSON.parse(ls.getItem(videoId))
		# console.log(result)
		return result

	# Saves plain JS objects to localStorage
	saveMovements: (videoId, movements) ->
		# console.log("saving #{movements.length} movements")
		ls.setItem(videoId, JSON.stringify(movements.map(@filtered)))


	# Cuts down a movement to its essential elements
	filtered: (m) ->
		# console.log(m.pausePoints)
		return {
			startTime: m.startTime
			endTime: m.endTime
			movementId: m.movementId
			name: m.name
			rawPausePoints: m.pausePoints
		}




}

module.exports = MVE_Storage