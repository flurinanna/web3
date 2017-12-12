class ProjectCollection {

    constructor(tag) {


        // Configuration
        this.localStorage_key = 'project';

        this.fetch();


        if (tag) {
            this.riotjs_tag = tag;
        }

    }


    all() {
        return this.collection;
    }

    // Saving collection to localStorage
    save(model) {
        var object = {
            "client_id": model.client_id,
            "title": model.title,
            "active": model.active,
        };
        $.ajax({
            method: "POST",
            url: "http://zhaw-issue-tracker-api.herokuapp.com/api/projects",
            data: JSON.stringify(object),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                console.log(response);
                this.collection.filter(actProject =>
                    actProject.client_id === response.client_id)[0].id = response.id;

                localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));

            }
        });

        localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));


    }

    // Adds a model to the collection and persists it
    add(model) {
        model.client_id = this.client_id();
        console.log(model.client_id);
        model.active = false;
        this.collection.push(model);
        this.save(model);
        this.riotjs_tag.update();

    }


    delete(model) {

        $.ajax({
            method: "DELETE",
            url: "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/" + model.id,
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                console.log(response)
                localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));
            }
        });
        this.collection = this.collection.filter(function (a) {
            return a.id != model.id;
        });
        localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));


    }



    // Fetch models from localStorage into collection
    fetch() {
        this.collection = JSON.parse(localStorage.getItem(this.localStorage_key)) || [];
    }

    client_id() {
        var client_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        console.log(client_id);
        return client_id;
    }
}
