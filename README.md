# Oska Health Code Test

## Introduction

Code tests are always weird, but we want to try and get as close to everyday development as we can in this odd environment.

This is deliberately not a complex algorithmic challenge; it's the kind of everyday feature work that full-stack devs spend much of their time on.

We're looking for clean, practical solutions that another developer can easily understand and extend in the future. We're also interested to see how you test your solution.

Time is limited, so you may not be able to implement everything during the test. This is totally fine - leaving a few comments to explain how you'd tackle the bits you didn't get round to would be great though.

We're more interested to learn about your approach to solving problems and your ability to communicate that approach when we meet/pair.

## Everyday development style

Please write code as you would do in the normal flow of development. No need to show off with overly complex architectures and no need to cut corners to get everything done if time is tight.

### Using libraries

Please don't feel like you need to write everything from scratch because this is a code test. If you can solve a problem quickly and cleanly with a well-written library, please do. Choosing which NPM package to use is a skill in itself.

### Using AI assistants

We use a variety of different AI assistants at Oska, and we'd encourage you to use whichever assistant you prefer. If you can generate high quality, well-tested code that does everything we've asked for with a bit of planning, a few follow up prompts and some manual tweaking, thats a plus for us, not cheating. Our only ask is that if you end up creating an AGENTS.md, CLAUDE.md or any other guidance or tooling, please leave it in place so we can see how you've structured it. When submitting your test, please let us know which agent you used.

When we meet/pair you'll be talking through the code and extending it, so even if it was written by a machine you should thoroughly understand it and be able to explain your decisions.

## Context

### Medical

One of the major causes of Chronic Kidney Disease (CKD) is high blood pressure.

Measuring changes in blood pressure over time and trying to reduce it is a key part of our programme.

A blood pressure reading is made up of two values:

- **Systolic** - The pressure exerted on your artery walls when your heart beats
- **Diastolic** - The resting pressure exerted on your artery walls between heart beats

### Technical

In this test we're creating a small part of a health metrics system that lives inside a NextJS application that's using the App Router.

The system has a dummy database/ORM with one "table" populated with some sample data and has a few functions:

- `db.bloodPressureReadings.list`
- `db.bloodPressureReadings.create`.
- `db.bloodPressureReadings.reset`.

## The test

We'll be creating a system that allows patients to submit a blood pressure reading.

### Part 1: Backend

#### Overview

We'd like you to create an endpoint that accepts blood pressure readings and persists them to our database.

#### API style

Since everyone has had different experiences with data transfer mechanisms, we're happy for you to use whatever you're most familiar with.

The NextJS project is set up to allow you to use the following:

- REST API routes
- tRPC
- Server functions

If you're not too familiar with NextJS, there are some very basic examples of how to set up each type of client/server communication method mentioned above.

If you would prefer to use another mechanism, feel free.

#### Validation

Please ensure that:

- The data is the correct shape
- Systolic reading is:
  - A positive integer
  - Between 50 and 300
  - Within 30% of an average of the last 5 readings
  - If there are less than 5 readings, do the same calculation with the available readings.
- Diastolic reading is:
  - A positive integer
  - Between 30 and 200
  - Within 15% of an average of the last 5 readings
  - If there are less than 5 readings, do the same calculation with the available readings.

If the validation passes:

- Persist the reading to our dummy database
- Return an appropriate response

If the validation fails:

- Return an appropriate error

#### Warnings

If the reading is outside the normal range, include a warning in the response:

Thresholds:

- Normal:
  - < 140 mmHg
  - No warning
- Higher than normal:
  - 140-159 mmHg
  - "Your blood pressure is higher than normal, contact your health coach"
- High:
  - 160-179 mmHg
  - "Your blood pressure is higher than normal, contact your doctor"
- Very high:
  - ≥ 180 mmHg
  - "Your blood pressure is higher than normal, contact your doctor immediately"

#### Example blood pressure reading

```json
{
  "systolic": 145,
  "diastolic": 85
}
```

#### Testing

We'd also like you to add some tests to ensure that the validation, warnings and persistence are working properly.

Vitest is already set up, so if you create a file with that ends in `.test.ts`
and run `npm run test` or `npm run test:watch` you should be good to go.

#### Deliberate omissons

We've deliberately kept the DB to one table and left out any kind of authentication to keep things simple, given time limitations.

### Part 2: Front end

#### Creating a form

We'd like you to create a form that allows users to submit their blood pressure readings to the endpoint that you created in part 1.

#### Handling errors

Make sure to account for whichever kinds of errors you think are appropriate for a form like this.

#### Displaying warnings

If a warning is returned, display it to the user as a simple JavaScript alert.

#### NPM to the rescue

Creating a form that submits to an endpoint with appropriate error handling completely from scratch is a lot of work. We've mentioned it before, but feel free to use a UI component library and/or a form handling system if you think it'll help you solve the problem in a reasonable amount of time.

#### UI

We're hiring a developer, not a designer, so don't worry if the UI isn't super polished. As long as the form is usable and errors are displayed in a useful way, that's fine.

Feel free to delete the existing list components for the mechanisms you're not using.

## Setting up the application

### Prerequisites

Ensure you're running Node 22+

### Installing dependencies

```bash
npm install
```

### Running the app

```bash
npm run dev
```

### Testing the app

The app has a basic `vitest` set up already configured, but feel free to switch
a different testing framework and/or add any other testing utilities that you think are useful.

```bash
npm run test
npm run test:watch
```

## Taking the test

### Options

We're happy for you to do the exercise as a take home test or as a paring exercise.

### Take home

Take as much or as little time as you need.

Note that if you do it as a take home test we'll still be pairing to extend the code you've written as part of the technical interview to get a feel for how you work in person.

When submitting:

1. Ensure everything is committed to git
2. Run `npm run zip-submission` to create a zip file in the root of the project
3. Add your name to the file name to `code-test-fullstack-next-firstname-lastname.zip`
4. Send it to jamie@oska-health.com

Gmail often rejects emails with zip file attachments, so sharing via Google Workspace, WeTransfer or another file sharing service is best, following up with an email in case the file sharing email is marked as spam.

### Pairing

If you're short on time and choose to do it as a pairing exercise and you use VSCode or a fork of VSCode, please make sure you have the [LiveShare extension](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) installed and set up before we meet.

If you use a different IDE, let us know the best way to pair with you. And if we can't make interactive pairing work, a screen share is fine.

We want to keep things as relaxed and productive as possible, so please feel very free to use Google, AI assistants and whatever else you'd usually use when writing code.

### Don't worry if you don't get it all done

Given the scope of the test, you may not be able to implement everything in the time you have available. This is totally fine. We'd rather see a portion of the test done well, than all of it done badly.

If you don't get to the end, please sketch out how you'd fill in the gaps.

## Wrapping up

Good luck with the test, we're really excited to see your submission.

And if you have feedback on how we can improve anything, please let us know.
