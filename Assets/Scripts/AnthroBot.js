//How far is the robot going?
var distance : float;

//How fast is the robot getting there?
var deltaT : float;

//Is the robot moving left to right?
var leftToRight : boolean;

//Direction based distance; for math purposes
private var deltaX : float;
private var deltaZ : float;
private var scaledDeltaX: float;
private var scaledDeltaZ : float;

//When did we start moving?
private var startTime : float;

//Direction of movement in int form
private var movementDirection : int;

private var startPosition : Vector3;
private var addedTime : int;

//Is the robot locking a door?
var isLockingDoor : boolean;
var door : GameObject;

//The player
private var playerAvatar : GameObject;
//This robot
private var enemy : GameObject;

//Textures for on/off states
var onTexture: Texture2D;
var offTexture: Texture2D;

//Is this the first time the Bot is hitting a door after it's
//behavior has been switched?
private var firstHit : boolean;

function Start () {
	var transform : Transform = GetComponent(Transform);

	startTime = Time.time;
	startPosition = transform.position;

	playerAvatar = GameObject.Find("Player");
	enemy = this.gameObject;

	if(leftToRight)
		deltaX = distance;
	else
		deltaZ = distance;

	scaledDeltaX = deltaX / deltaT;
	scaledDeltaZ = deltaZ / deltaT;
	
	SetTexture();
	
	firstHit = false;
}

/*
Sets the texture to on/off depending on behavior
*/
function SetTexture() {
	if(isLockingDoor)
		renderer.material.mainTexture = offTexture;
	else
		renderer.material.mainTexture = onTexture;
}

/*
Lets swap our routine!
*/
function Swap () {
	isLockingDoor = !isLockingDoor;
	SetTexture();
	firstHit = true;
}

/*
Check to see what we're hitting
*/
function CheckRaycast (hit : RaycastHit, movementVector : Vector3) {
	var distance = hit.distance;

	//Lets kill the player!
	if(hit.collider.gameObject.tag == "Player") {
		var hitTime = Time.time;
		while (hit.collider.gameObject.tag == "Player" && Physics.Raycast (transform.position, movementVector, hit, 100.0)) {
			//give the player time to escape
			if( Time.time < (hitTime + 2) ) {
				yield;
			}
			//addedTime += 2;
			else {
				//kill player, wait 2 seconds, reload level
				Destroy(playerAvatar);
				yield WaitForSeconds(2);
				Application.LoadLevel(Application.loadedLevel);
			}	
		}
	}
	//Door Locking/Unlocking
	else if (hit.collider.gameObject.tag == "Door") {
		if (isLockingDoor && firstHit) {
			door.GetComponent(Animation)["open"].speed = -1.0;
			door.GetComponent(Animation)["open"].time = door.GetComponent(Animation)["open"].length;
			door.GetComponent(Animation).Play("open");
			door.GetComponent(BoxCollider).isTrigger=false;
			firstHit = false;
		}
		else if (firstHit) {
			door.GetComponent(Animation)["open"].speed = 1.0;
			door.GetComponent(Animation)["open"].time = 0;
			door.GetComponent(Animation).Play("open");
			door.GetComponent(BoxCollider).isTrigger=true;
			firstHit = false;
		}
	}
}

function Update () {
	Movement();
}

/*
Movement works thusly:
1. DeltaX/Z is the distance you want to travel to the other point the enemy moves to.
   Thus, Place the enemy GameObject at one point, set deltaX and deltaZ such that the enemy moves
   in the direction you want it to.
   If the enemy shouldn't move, set deltaX and deltaZ to 0.
2. DeltaT is the time it takes to get wherever you're going.
3. At that point, we traverse the path backways (travel the opposite amount each deltaTime,
   until we get hit deltaT*2.
4. Rinse, repeat.
*/
function Movement () {			

	var transform : Transform = GetComponent(Transform);
	var currentTime = Time.time;
	var hit : RaycastHit;
	var movementVector : Vector3;

	//Which way are we moving?
	if(!leftToRight)
		movementVector = Vector3(0,0,100*movementDirection);
	else
		movementVector = Vector3(-100*movementDirection,0,0);
    
    //Check to see if we're hitting a player
    if (Physics.Raycast (transform.position, movementVector, hit, 100.0) && hit.collider.gameObject.tag == "Player" )
    	CheckRaycast(hit, movementVector);
	
	//Let's go for a walk!
	else if (currentTime < startTime + deltaT + addedTime) {
		movementDirection = -1;
		if(!leftToRight) {
			enemy.transform.eulerAngles.y = 270;
			transform.Translate(Time.deltaTime * scaledDeltaZ * -1, 0, Time.deltaTime * scaledDeltaX*movementDirection);
		}
		else {
			enemy.transform.eulerAngles.y = 90*movementDirection-90;
			transform.Translate(Time.deltaTime * scaledDeltaX*movementDirection, 0, Time.deltaTime * scaledDeltaZ);
		}
	}
	//Turning around and going back...
	else if (currentTime < (startTime + (deltaT * 2) + addedTime) ) {
		movementDirection = 1;
		if(!leftToRight) {
			enemy.transform.eulerAngles.y = 90;
			transform.Translate(Time.deltaTime * scaledDeltaZ * -1, 0, Time.deltaTime * scaledDeltaX*-movementDirection);
		}
		else {
			enemy.transform.eulerAngles.y = 0;
			transform.Translate(Time.deltaTime * scaledDeltaX*-movementDirection, 0, Time.deltaTime * scaledDeltaZ * -1);
		}
	}
	//Arriving back at the start...
	else {
		if(!leftToRight)
			enemy.transform.eulerAngles.y = 270;
		else
			enemy.transform.eulerAngles.y = 90*-1-90;
		transform.position = startPosition;
		startTime = Time.time;
		//addedTime = 0;
	}

	//Check to see if we're hitting a door
	if(Physics.Raycast (transform.position, movementVector, hit, 100.0) && hit.collider.gameObject.tag == "Door"){
		CheckRaycast(hit, movementVector);
	}

	//This draws the line in the scene window
	Debug.DrawLine (transform.position, transform.position+movementVector);
}