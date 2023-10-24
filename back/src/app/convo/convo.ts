export function makeConvo(name:string=""): model.IConvo {
	return {
		name: name,
		members: [],
		time_created: Date.now(),
		time_lastmsg: Date.now()
	}
}
