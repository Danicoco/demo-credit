<h2>DEMO CREDIT</h2>
<p>
The purpose of Demo Credit API is to facilitate Demo Credit mobile lending application and enable customers to recieve loan and also accept funding the account for repayment purpose.
</p>

<p>
<strong>NOTE:</strong> Recommended NodeJS version is v16.14.2
</p>

<h3>Prerequisites</h3>
<ol>
<li>Clone Project</li>
<li>Install Packages</li>
<code>
yarn install
</code>
<li>Run project</li>
<code>
yarn dev
</code>
</ol>

<h3>Project Structure</h3>
This project is structured as follows:
<ul>
<li>databases - Contains the migration files and initiate connection to the database</li>
<li>src - Contains the main code of the projject</li>
<li>modules - Contains a directory that hoist common functions and classes that can be reused across the project. And also directory(ies) of the versions of the project.</li>
<li>src - Contains the main code of the projject</li>
<li>views - Contains the templated paystack payment portal to accept payment from customers.</li>
</ul>

<h3>Modules</h3>
<p>Modules contains versions folder and distint criteria are splitted into modules which contains service, controller, route and validation.</p>

<h3>Database</h3>
<p>Check out the ER Diagram showing the flow of the database archetecture. <a href="https://app.dbdesigner.net/designer/schema/0-untitled-ca35312f-3c77-4adf-b98e-f7743287ed44">Click here</a></p>

<h3>Test</h3>
<code>yarn test</code>
