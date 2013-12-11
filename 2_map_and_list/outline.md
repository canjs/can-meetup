


## Basics

Linch-pin of the MVC pattern - the observable.

Organize state and data.

Easy to test.

- basic example of can.Map + can.List


## can.Map

	observable properties
	
- attr
	map.attr()
	map.attr(key)
	map.attr(key, value)
	map.attr(obj[, removeOthers])
	map.removeAttr()
	

- bind
	- change
	- name

- serialize

- defaults
- computes

- each / keys

## can.List

- attr

- bind
	- add
	- remove
	- length
	- change
	

- indexOf
- forEach / each

- mutators: pop / push / replace / shift / unshift / splice / sort

- subset: concat, join, reverse, slice

- Map

	
## Extending

// extending -> dist to time to travel
// extending -> fullName

## setter

locations



## async setter

## FSM

Turnstile = can.Map.extend({
  locked: true,
  coin: function(){
    this.attr("locked", false)
  },
  push: function(){
    this.attr("locked", true)
  }
})

Keyboard = can.Map.extend({
  caps: false,
  key: function(character){
    if(character === "CAPS") {
       this.attr("caps", !this.attr("caps"))
    } else {
    	// how do you "trigger" this?
    }
  }
})


Article = can.Map.extend({
  text: "",
  state: "in-progress",
  ownerId: null,
  setText: function(newText, success, error){
    if(Current.isAuthorOf(this) 
    	&& /in-progress|rejected/.test( this.attr("state")  ) ) {
      can.batch.start()
      this.attr("state")
      success(newText);
      can.batch.end()
	} else {
		error( "You don't have access or incorrect state"  )
	}
  },
  approve: function(){
    if( this.attr("state") === "ready" && Current.isEditor() ) {
      this.attr("state","approved")
    }
  },
  reject: function(){
    if( Current.isEditor() && this.attr("state") === "ready" ) {
      this.attr("state","rejected")
    }
  },
  publish: function(){
    if( Current.isPublisher() && this.attr("state") === "approved" ) {
      this.attr("state","published")
    }
  },
  unpublish: function(){
    if( Current.isPublisher() && this.attr("state") === "published" ) {
      this.attr("state","published")
    }
  }
})


## validations
	
## Paginate demo


	
	
## can.List

- attr



keys

extending

cid

batches

setters

attribute

backup

{{person.backup.name}}

{{person.isDirty}}

validations

Lazy