package com.r411.applicationtodo;

import androidx.annotation.NonNull;
import org.json.JSONException;
import org.json.JSONObject;

public class Task {
    public String title;

    public String description;

    public String date;

    public String context;

    public String link;

    public Task(String title, String description, String date, String context, String link) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.context = context;
        this.link = link;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContext() {
        return this.context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getLink() {
        return this.link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @NonNull
    public String toString() {
        return "Task{" +
                "title='" + this.title + '\'' +
                ", description='" + this.description + '\'' +
                ", date='" + this.date + '\'' +
                ", context='" + this.context + '\'' +
                ", link='" + this.link + '\'' +
                '}';
    }

    public static Task fromJSON(JSONObject obj) throws JSONException {
        return new Task(obj.getString("title"), obj.getString("description"), obj.getString("date"), obj.getString("context"), obj.getString("link"));
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject obj = new JSONObject();
        obj.put("title", this.title);
        obj.put("description", this.description);
        obj.put("date", this.date);
        obj.put("context", this.context);
        obj.put("link", this.link);
        return obj;
    }
}
