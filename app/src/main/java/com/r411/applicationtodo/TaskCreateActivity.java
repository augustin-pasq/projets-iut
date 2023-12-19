package com.r411.applicationtodo;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.icu.util.Calendar;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import org.apache.commons.validator.routines.UrlValidator;
import org.json.JSONException;
import java.util.Objects;

public class TaskCreateActivity extends AppCompatActivity {
    public SharedPreferences sharedPreferences;
    public SharedPreferences.Editor editor;

    @SuppressLint("ClickableViewAccessibility")
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

        View parentView = findViewById(R.id.form_container);
        parentView.setOnClickListener(view -> {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        });

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
            runOnUiThread(() -> Toast.makeText(TaskCreateActivity.this, "Tous les champs doivent être remplis.", Toast.LENGTH_LONG).show());
        } else if (!(new UrlValidator()).isValid(url)) {
            runOnUiThread(() -> Toast.makeText(TaskCreateActivity.this, "Le lien est invalide.", Toast.LENGTH_LONG).show());
        } else {
            Task task = new Task(title.getText().toString(), description.getText().toString(), date.getText().toString(), context.getText().toString(), url);
            String taskId = String.valueOf(this.sharedPreferences.getAll().size());
            String taskString = task.toJSON().toString();

            this.editor.putString(taskId, taskString);
            this.editor.commit();

            Intent intent = new Intent(TaskCreateActivity.this, TaskListActivity.class);
            intent.putExtra("taskId", taskId);
            intent.putExtra("taskContent", taskString);
            setResult(RESULT_OK, intent);
            this.finish();
        }
    }

    public void closeActivity(View view) {
        this.finish();
    }
}