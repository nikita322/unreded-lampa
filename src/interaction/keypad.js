import Subscribe from '../utils/subscribe'
import Controller from './controller'
import Activity from './activity'
// REMOVED: import Noty from './noty' - Notification system removed
import Sound from '../utils/sound'
import Plathorm from '../utils/platform'

let enabled  = false
let listener = Subscribe()
let time     = 0
let lastdown = 0
let timer
let longpress
let keydown  = false
let canianimate = typeof requestAnimationFrame !== 'undefined'
let frame_time = 0
let keydown_time = 0


function toggle(new_status){
    enabled = new_status

    listener.send('toggle',{status: enabled})
}

function enable(){
    toggle(true)
}

function disable(){
    toggle(false)
}

function isEnter(keycode){
	return keycode == 13 || keycode == 29443 || keycode == 117 || keycode == 65385
}

function keyCode(e){
	var keycode
	 
	if(window.event) { 
	    keycode = e.keyCode;
	} else if(e.which) { 
	    keycode = e.which;
	}

	return keycode
}

function requestFrame() {
    keydownTrigger(keydown)

    keydown = false

	frame_time = Date.now()
}

function keydownTrigger(e){
	let keycode = keyCode(e)

	//// REMOVED: Noty.show( - Notification system removed: // keycode)

	keydown_time = Date.now()

	if(time > Date.now() - 100) return

	time = Date.now()

	listener.send('keydown',{code: keycode, enabled: enabled, event: e})

	if(e.defaultPrevented) return

	if(isEnter(keycode)) return

	if(!enabled) return; //отключить все

	if (keycode == 37) {
		Sound.play('hover')

		Controller.move('left')
	}
	if (keycode == 38) {
		Sound.play('hover')

		Controller.move('up')
	}
	if (keycode == 39) {
		Sound.play('hover')

		Controller.move('right')
	}
	if (keycode == 40) {
		Sound.play('hover')

		Controller.move('down')
	}
	if (keycode == 33) {
		Sound.play('hover')

		Controller.move('toup')
	}
	if (keycode == 34) {
		Sound.play('hover')

		Controller.move('todown')
	}

	//Абсолютный Enter
	if (keycode == 13) {
		//if(!App.Keybord.opened) Controller.finish();
	}

	//Space
	if(keycode == 32 || keycode == 179){
		Controller.trigger('playpause');
	}

	//Media play
	if(keycode == 415){
		Controller.trigger('play');
	}

	//Media stop
	if(keycode == 413){
		Controller.trigger('stop');
	}

	//Rewind back
	if(keycode == 412 || keycode == 177){
		Controller.trigger('rewindBack');
	}

	//Rewind forward
	if(keycode == 418 || keycode == 417 || keycode == 176){
		Controller.trigger('rewindForward');
	}

	//Pause
	if(keycode == 19){
		Controller.trigger('pause');
	}

	if(keycode == 457){
		Controller.trigger('info');
	}

	//E-Manual
	if(keycode == 10146){
		e.preventDefault()
	}

	if(keycode == 10133){
		Controller.toggle('settings')
	}
	
	//Кнопка назад
	if (keycode == 8 || keycode == 27) {
		e.preventDefault()

		// REMOVED: if(window.god_enabled) Lampa.Noty.show(...) - Notification system removed

		if(window.appready) Controller.back()

		return false
	}

	e.preventDefault()
}

function init(){
	window.addEventListener("keydown", function (e) {
		lastdown = keyCode(e)

		if(!timer){
			timer = setTimeout(()=>{
				if(isEnter(lastdown)){
					longpress = true

					listener.send('longdown',{})

					Controller.long()
				}
			},800)
		}
	})

	window.addEventListener("keyup", function (e) {
		clearTimeout(timer)

		time = 0

		timer = null

		listener.send('keyup',{code: keyCode(e), enabled: enabled, event: e})

		if(!longpress){
			if(isEnter(keyCode(e)) && !e.defaultPrevented){
				Sound.play('enter')

				Controller.enter()
			} 
		}
		else longpress = false
	})

	window.addEventListener("keydown", function (e) {
		if(canianimate){
			let cannow = Date.now() - frame_time > 500
			let presed = keydown

			keydown = e

			if(presed === false){
				if(cannow) requestFrame()
				else requestAnimationFrame(requestFrame)
			}
		}
		else{
			keydownTrigger(e)
		}
	})
}

export default {
    listener,
	init,
    enable,
    disable
}
