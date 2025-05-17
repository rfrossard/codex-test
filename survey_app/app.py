from flask import Flask, render_template, request, redirect, url_for
import json
import uuid

app = Flask(__name__)

# Simple in-memory storage
SURVEYS = {}
RESPONSES = {}

@app.route('/')
def index():
    return redirect(url_for('create_survey'))

@app.route('/create', methods=['GET', 'POST'])
def create_survey():
    if request.method == 'POST':
        title = request.form['title']
        emails = [e.strip() for e in request.form['emails'].split(',') if e.strip()]
        questions = []
        q_texts = request.form.getlist('question')
        for q in q_texts:
            questions.append({'text': q})
        survey_id = str(uuid.uuid4())
        SURVEYS[survey_id] = {
            'title': title,
            'emails': emails,
            'questions': questions
        }
        RESPONSES[survey_id] = []
        # send emails (placeholder)
        survey_link = url_for('take_survey', survey_id=survey_id, _external=True)
        for email in emails:
            print(f"Send email to {email} with link: {survey_link}")
        return redirect(url_for('admin', survey_id=survey_id))
    return render_template('create_survey.html')

@app.route('/survey/<survey_id>', methods=['GET', 'POST'])
def take_survey(survey_id):
    survey = SURVEYS.get(survey_id)
    if not survey:
        return "Survey not found", 404
    if request.method == 'POST':
        answers = {}
        for idx, q in enumerate(survey['questions']):
            answers[q['text']] = request.form.get(f'q{idx}')
        RESPONSES[survey_id].append(answers)
        return 'Obrigado por responder!'
    return render_template('survey.html', survey=survey, survey_id=survey_id)

@app.route('/admin/<survey_id>')
def admin(survey_id):
    survey = SURVEYS.get(survey_id)
    if not survey:
        return "Survey not found", 404
    responses = RESPONSES.get(survey_id, [])
    return render_template('admin.html', survey=survey, responses=responses)

if __name__ == '__main__':
    app.run(debug=True)
