package com.r411.applicationtodo;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.icu.util.Calendar;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import org.apache.commons.validator.routines.UrlValidator;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class TaskEditActivity extends AppCompatActivity {
    public SharedPreferences sharedPreferences;
    public SharedPreferences.Editor editor;
    public String taskId;
    public Task taskObj;

    @SuppressLint({"ClickableViewAccessibility", "SetTextI18n"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_form);

        this.sharedPreferences = getApplicationContext().getSharedPreferences("Tasks", 0);
        this.editor = this.sharedPreferences.edit();
            
        String[] items = {"Ma journée", "Bureau", "Maison", "Urgent"};
        AutoCompleteTextView textField = findViewById(R.id.contextItem);
        textField.setFocusable(false);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, items);
        textField.setAdapter(adapter);

        TextInputEditText editTextDate = findViewById(R.id.dateField);
        editTextDate.setFocusable(false);
        editTextDate.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_UP) {
                showDatePicker(editTextDate);
                return true;
            }
            return false;
        });

        Button cancelButton = findViewById(R.id.cancel_button);
        cancelButton.setOnClickListener(v -> this.finish());

        try {
            Intent intent = getIntent();
            this.taskId = intent.getStringExtra("taskId");
            JSONObject taskJson = new JSONObject(intent.getStringExtra("taskContent"));
            this.taskObj = Task.fromJSON(taskJson);
            
            TextView activityName = findViewById(R.id.activity_name);
            MaterialButton submitButton = findViewById(R.id.submit_button);
            activityName.setText("Modifier la tâche");
            submitButton.setText("Modifier la tâche");
            submitButton.setIconResource(R.drawable.ic_edit_24dp);

            TextInputLayout titleLayout = findViewById(R.id.title);
            TextInputLayout descriptionLayout = findViewById(R.id.description);
            TextInputLayout dateLayout = findViewById(R.id.date);
            TextInputLayout contextLayout = findViewById(R.id.context);
            TextInputLayout linkLayout = findViewById(R.id.link);

            EditText title = titleLayout.getEditText();
            EditText description = descriptionLayout.getEditText();
            EditText date = dateLayout.getEditText();
            EditText context = contextLayout.getEditText();
            EditText link = linkLayout.getEditText();

            Objects.requireNonNull(title).setText(this.taskObj.getTitle());
            Objects.requireNonNull(description).setText(this.taskObj.getDescription());
            Objects.requireNonNull(date).setText(this.taskObj.getDate());
            Objects.requireNonNull(context).setText(this.taskObj.getContext());
            Objects.requireNonNull(link).setText(this.taskObj.getLink());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    private void showDatePicker(TextInputEditText editTextDate) {
        final Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(this,
                (view, year1, monthOfYear, dayOfMonth1) -> {
                    String monthFormatted = (monthOfYear + 1) < 10 ? "0" + (monthOfYear + 1) : String.valueOf(monthOfYear + 1);
                    String selectedDate = dayOfMonth1 + "/" + monthFormatted + "/" + year1;
                    editTextDate.setText(selectedDate);
                }, year, month, dayOfMonth);

        datePickerDialog.getDatePicker().setMinDate(System.currentTimeMillis() - 1000);
        datePickerDialog.show();
    }

    public void sendTask(View view) throws JSONException {
        TextInputLayout titleLayout = findViewById(R.id.title);
        TextInputLayout descriptionLayout = findViewById(R.id.description);
        TextInputLayout dateLayout = findViewById(R.id.date);
        TextInputLayout contextLayout = findViewById(R.id.context);
        TextInputLayout linkLayout = findViewById(R.id.link);

        EditText title = titleLayout.getEditText();
        EditText description = descriptionLayout.getEditText();
        EditText date = dateLayout.getEditText();
        EditText context = contextLayout.getEditText();
        EditText link = linkLayout.getEditText();

        boolean titleEmpty = Objects.requireNonNull(title).getText().toString().equals("");
        boolean descriptionEmpty = Objects.requireNonNull(description).getText().toString().equals("");
        boolean dateEmpty = Objects.requireNonNull(date).getText().toString().equals("");
        boolean contextEmpty = Objects.requireNonNull(context).getText().toString().equals("");
        String url = Objects.requireNonNull(link).getText().toString();

        if (titleEmpty || descriptionEmpty || dateEmpty || contextEmpty || url.equals("")) {
            runOnUiThread(() -> Toast.makeText(TaskEditActivity.this, "Tous les champs doivent être remplis.", Toast.LENGTH_LONG).show());
        } else if (!(new UrlValidator()).isValid(url)) {
            runOnUiThread(() -> Toast.makeText(TaskEditActivity.this, "Le lien est invalide.", Toast.LENGTH_LONG).show());
        } else {
            this.taskObj.setTitle(title.getText().toString());
            this.taskObj.setDescription(description.getText().toString());
            this.taskObj.setDate(date.getText().toString());
            this.taskObj.setContext(context.getText().toString());
            this.taskObj.setLink(url);

            String taskString = this.taskObj.toJSON().toString();

            this.editor.putString(this.taskId, taskString);
            this.editor.commit();

            Intent intent = new Intent(TaskEditActivity.this, TaskDescActivity.class);
            intent.putExtra("taskId", this.taskId);
            intent.putExtra("taskContent", taskString);
            setResult(RESULT_OK, intent);
            this.finish();
        }
    }

    public void closeActivity(View view) {
        this.finish();
    }
}