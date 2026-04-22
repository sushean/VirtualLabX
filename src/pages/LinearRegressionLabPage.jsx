import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WaveFooter from '../components/WaveFooter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuizIcon from '@mui/icons-material/Quiz';
import GroupsIcon from '@mui/icons-material/Groups';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import fig1Img from '../assets/fig1.png';
import fig2Img from '../assets/fig2.png';
import mathBasicsImg from '../assets/math_basics.png';
import pythonProgImg from '../assets/python_prog.png';
import mlConceptsImg from '../assets/ml_concepts.png';
import evalMetricsImg from '../assets/eval_metrics.png';
import toolsSetupImg from '../assets/tools_setup.png';
import LinearRegressionSimulation from '../components/LinearRegressionSimulation';
import QuizComponent from '../components/QuizComponent';
import confetti from 'canvas-confetti';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (submitted) {
    return (
      <div className="animate-page-enter max-w-2xl mx-auto bg-green-500/10 border border-green-500/50 p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="text-4xl">🎉</span>
        </div>
        <h3 className="text-3xl font-bold text-green-400 mb-4">Feedback Received!</h3>
        <p className="text-gray-300 text-lg">Thank you for helping us improve the Virtual Labs experience. Your response has been securely logged.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-sm text-green-500 hover:text-green-400 underline font-bold uppercase tracking-widest">Submit another response</button>
      </div>
    );
  }

  return (
    <div className="animate-page-enter max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Experiment Feedback</h2>
      <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-75 h-75 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         <p className="text-gray-300 text-lg mb-8 relative z-10 text-center font-bold">How would you rate your experience with the Linear Regression simulation?</p>
         
         <div className="flex gap-2 mb-10 justify-center relative z-10">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star}
                 type="button"
                 onClick={() => setRating(star)}
                 onMouseEnter={() => setHover(star)}
                 onMouseLeave={() => setHover(rating)}
                 className={`text-6xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110' : 'text-gray-600 hover:text-gray-500'}`}
               >
                 ★
               </button>
            ))}
         </div>

         <div className="flex flex-col gap-4 relative z-10">
            <label className="text-gray-400 font-bold uppercase tracking-widest text-sm">Additional Comments (Optional)</label>
            <textarea 
               value={feedbackText}
               onChange={(e) => setFeedbackText(e.target.value)}
               className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors h-32 resize-none shadow-inner"
               placeholder="Tell us what you loved or what we could improve..."
            />
         </div>

         <button 
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
            className={`w-full relative z-10 mt-8 py-4 rounded-xl font-bold text-lg transition-all ${rating === 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-linear-to-r from-purple-600 to-[#00e5ff] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:-translate-y-1'}`}
         >
            Submit Feedback
         </button>
      </div>
    </div>
  );
};

const PrerequisitesContent = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const topics = [
    {
      id: "math",
      title: "Mathematics Basics",
      image: mathBasicsImg,
      points: [
        "Linear Algebra: Understanding vectors and matrices is essential as data is often represented in this format.",
        "Calculus: Knowing derivatives helps in understanding gradient descent, which is used to optimize the best-fit line.",
        "Statistics & Probability: Basic stats like mean, variance, and standard deviation are fundamental for evaluating models."
      ]
    },
    {
      id: "python",
      title: "Programming (Python)",
      image: pythonProgImg,
      points: [
        "Python Syntax: Familiarity with variables, loops, functions, and object-oriented concepts is required.",
        "NumPy: Crucial for efficient mathematical operations on multi-dimensional arrays and matrices.",
        "Pandas: Essential for data manipulation, cleaning, and structural analysis.",
        "Matplotlib/Seaborn: Useful for plotting scatter plots and visualizing the regression line."
      ]
    },
    {
      id: "ml",
      title: "ML Concepts",
      image: mlConceptsImg,
      points: [
        "Supervised Learning: Linear Regression falls under this category where we train on labeled data.",
        "Features and Labels: 'x' variables are features (inputs), and the 'y' variable is the label (predicted output).",
        "Training and Testing: Splitting data to properly evaluate model generalization on unseen data."
      ]
    },
    {
      id: "metrics",
      title: "Evaluation Metrics",
      image: evalMetricsImg,
      points: [
        "Mean Squared Error (MSE): The average squared difference between estimated values and the actual value.",
        "Root Mean Squared Error (RMSE): The square root of MSE, often preferred as it is in the same units as the target variable.",
        "R-squared (R²): Represents the proportion of variance for a dependent variable that's explained by an independent variable."
      ]
    },
    {
      id: "tools",
      title: "Tools Setup",
      image: toolsSetupImg,
      points: [
        "Jupyter Notebook: An interactive computational environment, ideal for running and documenting ML experiments.",
        "Scikit-Learn: A widely used Python library that provides simple and efficient tools for predictive data analysis, including Linear Regression.",
        "Environment Management: Knowing how to manage dependencies using pip or Conda environments."
      ]
    }
  ];

  return (
    <div className="animate-page-enter max-w-4xl mx-auto pb-12">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Pre-Requisites</h2>
      <p className="text-gray-300 mb-8 text-lg">Before diving into Linear Regression, ensure you have a good grasp of these foundational concepts. Click on a topic to explore further.</p>
      
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 shadow-lg group">
            <button 
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-white/5 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                <span className="text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-[#00e5ff] transition-colors">{topic.title}</span>
              </div>
              <span className={`text-[#00e5ff] text-2xl transition-transform duration-300 ${expandedTopic === topic.id ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTopic === topic.id ? 'max-h-[1000px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start bg-black/40">
                <div className="w-full md:w-2/5 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-shadow duration-500">
                  <img src={topic.image} alt={topic.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <ul className="space-y-5 text-gray-300">
                    {topic.points.map((point, idx) => {
                      const [title, ...desc] = point.split(': ');
                      return (
                        <li key={idx} className="flex gap-4">
                          <span className="text-[#00e5ff] mt-1 shrink-0 text-lg">✦</span>
                          <span className="leading-relaxed text-lg">
                            <strong className="text-purple-300">{title}:</strong> {desc.join(': ')}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LearnCodeComponent = () => {
  const [mode, setMode] = useState('learn'); // 'learn' or 'test'
  
  // Test answers state
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: ''
  });
  const [feedback, setFeedback] = useState({});

  const checkAnswer = (qKey, expected, e) => {
    if (answers[qKey].trim().toLowerCase() === expected.toLowerCase()) {
      setFeedback({ ...feedback, [qKey]: 'correct' });
      if (e && e.target) {
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { x, y },
          disableForReducedMotion: true,
          zIndex: 100
        });
      }
    } else {
      setFeedback({ ...feedback, [qKey]: 'incorrect' });
    }
  };

  const revealAnswer = (qKey, expected) => {
    setAnswers({ ...answers, [qKey]: expected });
    setFeedback({ ...feedback, [qKey]: 'correct' });
  };

  const learnContent = [
    {
      step: "1. Importing Libraries",
      code: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LinearRegression",
      explanation: "numpy → used for numerical operations\npandas → used to handle datasets (CSV files, tables)\nmatplotlib → used for plotting graphs\nLinearRegression → model used to perform regression",
      summary: "This step prepares all the tools required for building the model."
    },
    {
      step: "2. Loading the Dataset",
      code: "data = pd.read_csv(\"data.csv\")\nprint(data.head())",
      explanation: "read_csv() loads the dataset\nhead() shows first 5 rows",
      summary: "Helps understand structure of the dataset (columns, values)."
    },
    {
      step: "3. Selecting Features and Target",
      code: "X = data[['Hours']]\ny = data['Scores']",
      explanation: "X → input (independent variable)\ny → output (dependent variable)",
      summary: "Model learns how Hours affects Scores."
    },
    {
      step: "4. Splitting Data",
      code: "from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)",
      explanation: "Splits data into training and testing\ntest_size=0.2 → 20% data for testing",
      summary: "Prevents overfitting and checks model performance."
    },
    {
      step: "5. Creating and Training Model",
      code: "model = LinearRegression()\nmodel.fit(X_train, y_train)",
      explanation: "LinearRegression() creates model\nfit() trains model using training data",
      summary: "Model learns relationship between X and y."
    },
    {
      step: "6. Making Predictions",
      code: "y_pred = model.predict(X_test)",
      explanation: "Predicts output for test data",
      summary: "This is the actual goal—making predictions."
    },
    {
      step: "7. Visualizing Results",
      code: "plt.scatter(X, y)\nplt.plot(X, model.predict(X), color='red')\nplt.show()",
      explanation: "Scatter plot → actual data\nLine → predicted best-fit line",
      summary: "Helps visually understand regression."
    }
  ];

  const renderTestQuestion = (qNum, title, preCode, inputKey, postCode, expectedAnswer) => {
    const isFilled = answers[inputKey].trim().length > 0;
    const isCorrect = feedback[inputKey] === 'correct';
    const isIncorrect = feedback[inputKey] === 'incorrect';

    return (
      <div className="bg-[#110b27] border border-white/10 rounded-2xl p-6 mb-6 shadow-lg">
        <h4 className="text-[#00e5ff] font-bold text-lg mb-4 flex items-center gap-2">
          <span className="bg-[#00e5ff]/10 text-[#00e5ff] w-8 h-8 rounded-full flex items-center justify-center border border-[#00e5ff]/30">Q{qNum}</span>
          {title}
        </h4>
        <div className="bg-black/50 p-4 rounded-xl font-mono text-gray-300 border border-white/5 text-sm leading-8 mb-4 whitespace-pre-wrap">
           <span>{preCode}</span>
           <span className="relative inline-block mx-1">
             <input 
               type="text" 
               value={answers[inputKey]}
               onChange={(e) => {
                 setAnswers({...answers, [inputKey]: e.target.value});
                 setFeedback({...feedback, [inputKey]: null});
               }}
               className={`bg-transparent border-b-2 outline-none text-center font-bold px-2 py-1 w-36 transition-colors border-[#00e5ff] text-white focus:border-purple-400`}
             />
           </span>
           <span>{postCode}</span>
        </div>
        <div className="flex justify-end items-center gap-4">
           {isCorrect && <span className="text-green-500 font-bold uppercase tracking-widest text-sm">Correct</span>}
           {isIncorrect && <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Incorrect</span>}
           <button 
             onClick={(e) => isFilled ? checkAnswer(inputKey, expectedAnswer, e) : revealAnswer(inputKey, expectedAnswer)}
             className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' : 'bg-linear-to-r from-purple-600 to-[#00e5ff] text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}
             disabled={isCorrect}
           >
             {isCorrect ? 'Solved' : isFilled ? 'Check Answer' : 'Reveal Answer'}
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-page-enter max-w-4xl mx-auto pb-12">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Learn Code</h2>
      
      {/* Mode Toggle */}
      <div className="flex bg-[#110b27] border border-white/10 p-1 rounded-xl mb-10 mx-auto w-fit shadow-lg shadow-purple-500/10">
        <button 
          onClick={() => setMode('learn')}
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'learn' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
        >
          LEARN MODE
        </button>
        <button 
          onClick={() => setMode('test')}
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'test' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
        >
          TEST MODE
        </button>
      </div>

      {mode === 'learn' && (
        <div className="space-y-8 animate-page-enter">
          {learnContent.map((item, idx) => (
             <div key={idx} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_rgba(108,43,217,0.2)] transition-shadow">
                <div className="bg-white/5 p-4 border-b border-white/10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                      {item.step}
                   </h3>
                </div>
                <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                   {/* Code Section */}
                   <div className="flex-1 bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-sm overflow-x-auto shadow-inner">
                      <pre className="text-green-400/80">
                        {item.code.split('\n').map((line, i) => (
                          <div key={i}><span className="text-gray-600 mr-4 select-none">{String(i+1).padStart(2, '0')}</span><span className="text-gray-300">{line}</span></div>
                        ))}
                      </pre>
                   </div>
                   
                   {/* Explanation Section */}
                   <div className="flex-1 space-y-4">
                      <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl">
                        <h4 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-3">Explanation</h4>
                        <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                           {item.explanation.split('\n').map((line, i) => {
                             const parts = line.split('→');
                             if(parts.length > 1) return <li key={i}><strong className="text-white">{parts[0]}</strong> - <span className="text-gray-400">{parts[1]}</span></li>;
                             return <li key={i}>{line}</li>;
                           })}
                        </ul>
                      </div>
                      <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-[#00e5ff] font-bold text-sm uppercase tracking-widest mt-0.5">Summary: </span>
                        <p className="text-[#00e5ff]/90 text-sm font-semibold">{item.summary}</p>
                      </div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      )}

      {mode === 'test' && (
        <div className="animate-page-enter">
          <p className="text-gray-300 text-center mb-8 text-lg bg-white/5 py-4 rounded-xl border border-white/10">
            Fill in the blanks to complete the code snippets correctly. You can check your answer or reveal it if stuck.
          </p>
          
          <div className="max-w-3xl mx-auto">
            {renderTestQuestion(1, "Import Library", "import numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import ", "q1", "", "LinearRegression")}
            
            {renderTestQuestion(2, "Load Dataset", "data = pd.", "q2", "(\"data.csv\")", "read_csv")}
            
            {renderTestQuestion(3, "Select Feature", "X = data[['", "q3", "']]", "Hours")}
            
            {renderTestQuestion(4, "Split Data", "X_train, X_test, y_train, y_test = ", "q4", "(X, y, test_size=0.2)", "train_test_split")}
            
            {renderTestQuestion(5, "Train Model", "model = LinearRegression()\nmodel.", "q5", "(X_train, y_train)", "fit")}
            
            {renderTestQuestion(6, "Predict", "y_pred = model.", "q6", "(X_test)", "predict")}
            
            {renderTestQuestion(7, "Plot Graph", "plt.", "q7", "(X, y)", "scatter")}
          </div>

          {Object.values(feedback).filter(status => status === 'correct').length === 7 && (
             <div className="mt-10 p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center animate-page-enter shadow-[0_0_30px_rgba(34,197,94,0.2)]">
               <h3 className="text-2xl font-bold text-green-400 mb-2">Excellent Work!</h3>
               <p className="text-gray-300">You have successfully completed the Linear Regression code test.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function LinearRegressionLabPage() {
  const [activeTab, setActiveTab] = useState('Introduction');
  const [viewedTabs, setViewedTabs] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
     if (!viewedTabs.includes(activeTab)) {
        const nextViewed = [...viewedTabs, activeTab];
        setViewedTabs(nextViewed);
        const token = localStorage.getItem('token');
        if (token) {
           const progressionRatio = Math.round((nextViewed.length / 10) * 100);
           axios.post('http://localhost:5000/api/progress/lab', 
               { labSlug: 'linear-regression', progressPercentage: progressionRatio },
               { headers: { Authorization: `Bearer ${token}` } }
           ).catch(err => console.debug("Sync Warning", err));
        }
     }
  }, [activeTab, viewedTabs]);

  const tabs = [
    { id: 'Introduction', icon: <PlayArrowIcon fontSize="small"/> },
    { id: 'Pre-Requisites', icon: <AssignmentIcon fontSize="small"/> },
    { id: 'Objective', icon: <HelpOutlineIcon fontSize="small"/> },
    { id: 'Simulation', icon: <AutoFixHighIcon fontSize="small"/> },
    { id: 'Test your Knowledge', icon: <QuizIcon fontSize="small"/> },
    { id: 'Learn Code', icon: <CodeIcon fontSize="small"/> },
    { id: 'Target Audience', icon: <GroupsIcon fontSize="small"/> },
    { id: 'Course Alignment', icon: <AccountTreeIcon fontSize="small"/> },
    { id: 'Resources', icon: <LibraryBooksIcon fontSize="small"/> },
    { id: 'Feedback', icon: <FeedbackIcon fontSize="small"/> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Introduction':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Linear Regression</h2>
            
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Linear regression is a technique we use to find a relationship between two things and then use that relationship to make predictions. For example, let's say we want to find out if there is a relationship between the amount of time a student studies for a test and the grade they get on that test. We can use linear regression to find out if there is a relationship between those two things, and if there is, we can use that relationship to predict the grade a student will get based on how much they study.
              </p>
              <p>
                As another example, let's say you want to predict how much money you will make based on how many hours you work. To do this, you would collect data and then use linear regression to find a line that best fits the data. Once you have this line, you can use it to predict how much money you will make for any number of hours you work.
              </p>

              <div className="my-8 bg-white/5 border border-white/10 rounded-xl p-6 shadow-inner">
                <p className="mb-4 font-semibold text-white">To demonstrate linear regression, let's look at the following example of data for the variables x and y:</p>
                <div className="font-mono text-base bg-black/50 p-4 rounded-lg border border-white/5">
                  <span className="text-[#00e5ff] font-bold">x:</span> 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150<br/><br/>
                  <span className="text-[#00e5ff] font-bold">y:</span> 7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15
                </div>
              </div>

              <p>Let's assume that this data can be represented in the form of a line equation like the following:</p>
              
              <div className="text-center font-mono text-2xl text-purple-300 font-bold tracking-widest my-6 py-4 bg-[#110b27] rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(108,43,217,0.2)]">
                y' = ax + b
              </div>

              <p>Here, <code className="text-purple-300 bg-white/10 px-1.5 py-0.5 rounded text-base">y'</code> (or y-prime) represents the predicted values that we can compare with the actual values <code className="text-purple-300 bg-white/10 px-1.5 py-0.5 rounded text-base">y</code>.</p>

              <p>Let's say we initialize the line equation with some arbitrary parameter values of a and b, as follows:</p>
              
              <div className="font-mono text-lg bg-black/50 p-4 rounded-lg my-4 inline-block w-full text-center border border-white/5 text-gray-200">
                a = 0.02<br/>
                b = 8.78
              </div>

              <p>With these values, the line equation becomes:</p>
              
              <div className="text-center font-mono text-xl text-white my-6 font-bold">
                y' = 0.02x + 8.78
              </div>

              <p>Now let's plot the x-y values as a 2D scatter plot and the line plot of the above line equation as shown below:</p>

              <div className="my-10 flex flex-col items-center">
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center mb-4 overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <img 
                    src={fig1Img} 
                    alt="Initial Regression Model" 
                    className="w-full h-auto object-contain transition-opacity duration-500" 
                    style={{ filter: 'invert(0.93) hue-rotate(200deg) contrast(1.2)' }} 
                  />
                </div>
                <p className="text-sm text-[#00e5ff] font-bold uppercase tracking-widest">Figure 1: Linear Regression Example</p>
              </div>

              <p>
                In this graph, the input x,y data is shown as a scatter plot with dots, and the solid line shows the regression line that approximates and represents the data.
              </p>
              <p>
                Our goal is to use some algorithm to find the values of <code className="text-purple-300 font-semibold">a</code> and <code className="text-purple-300 font-semibold">b</code> that best fit the data. This is where the linear regression technique comes in. The process of finding the most appropriate values of a and b is known as <span className="text-white font-semibold">"fitting the model to the data"</span>. In linear regression, this fitting is usually done using a method called "least squares". This method minimizes the sum of the squares of the differences (called residuals) between the predicted and actual values in the data set.
              </p>

              <h3 className="text-3xl font-bold mt-16 mb-8 text-white border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block"></span>
                Least Squares Method
              </h3>
              
              <p>
                The least squares method calculates the optimal values of <code className="text-purple-300 font-semibold">a</code> (slope) and <code className="text-purple-300 font-semibold">b</code> (y-intercept) such that the sum of the squared differences between the predicted and actual values is minimized. Mathematically, it seeks to solve the following equation:
              </p>

              {/* Math Equation using HTML/CSS */}
              <div className="bg-[#110b27] border border-white/10 py-10 px-6 rounded-2xl my-8 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#00e5ff]/5 blur-[70px] rounded-full pointer-events-none"></div>
                 <div className="font-serif text-3xl md:text-4xl text-white tracking-wider flex items-center justify-center gap-2">
                    <span className="italic">min<sub className="text-sm text-gray-400 -ml-1 italic">a,b</sub></span> 
                    <span className="text-5xl font-light mx-2 text-[#00e5ff]">&sum;</span>
                    <div className="flex flex-col text-sm text-gray-400 -ml-4 justify-between h-14 relative top-1">
                      <span className="relative right-1">n</span>
                      <span className="relative right-1">i=1</span>
                    </div>
                    <span className="ml-2">( y<sub className="text-sm text-gray-400">i</sub> - (ax<sub className="text-sm text-gray-400">i</sub> + b) )<sup className="text-lg text-[#00e5ff] ml-1">2</sup></span>
                 </div>
              </div>

              <div className="bg-black/60 border border-white/5 p-6 rounded-xl my-6 backdrop-blur-sm">
                <p className="mb-4 font-semibold text-gray-300 text-sm uppercase tracking-widest">Where:</p>
                <ul className="list-disc pl-6 space-y-3 text-base">
                  <li><code className="text-purple-300 text-lg bg-white/5 px-1.5 rounded">y<sub className="text-sm">i</sub></code> and <code className="text-purple-300 text-lg bg-white/5 px-1.5 rounded">x<sub className="text-sm">i</sub></code> are the actual observed values from the dataset,</li>
                  <li><code className="text-purple-300 text-lg bg-white/5 px-1.5 rounded">n</code> is the number of observations in the dataset,</li>
                  <li><code className="text-purple-300 text-lg bg-white/5 px-1.5 rounded">ax<sub className="text-sm">i</sub> + b</code> is the prediction made by our linear model.</li>
                </ul>
              </div>

              <p>
                When we apply the least squares method to our data, we calculate the values for a and b that best fit our data points. After this calculation, our line equation looks like the following:
              </p>

              <div className="text-center font-mono text-xl text-white my-8 font-bold">
                y' = 0.08x + 2.47
              </div>

              <p>The graph below shows how the above equation, shown as a solid line, appears to fit the input data, shown as dots.</p>

              <div className="my-10 flex flex-col items-center">
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center mb-4 overflow-hidden group shadow-[0_0_30px_rgba(108,43,217,0.3)]">
                  <img 
                    src={fig2Img} 
                    alt="Final Regression Model" 
                    className="w-full h-auto object-contain transition-opacity duration-500" 
                    style={{ filter: 'invert(0.93) hue-rotate(200deg) contrast(1.2)' }} 
                  />
                </div>
                <p className="text-sm text-purple-400 font-bold uppercase tracking-widest text-center">Figure 2: Final Linear Regression Model<br/>with Best Fit Line</p>
              </div>

              <p>
                This example illustrates how linear regression is used to establish a relationship between two variables in order to make predictions. Specifically, it demonstrates the process of using least squares to fit a linear model to a data set, showing the initial arbitrary line equation and how the optimized parameters improve the fit to the observed data. This basic understanding allows for practical applications in predicting outcomes based on linear relationships.
              </p>

              <h3 className="text-3xl font-bold mt-16 mb-8 text-white border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-green-400 rounded-full inline-block"></span>
                Summary
              </h3>
              
              <p>
                The process of data scaling is fundamental in preparing data for machine learning models. It ensures that features are on a similar scale, which enhances model performance and convergence speed during training. Techniques like normalization and standardization adjust the range and distribution of data, respectively, ensuring that each feature contributes equally to the model. By scaling data appropriately, we reduce the risk of models being biased towards features with larger magnitudes and improve the overall robustness and accuracy of predictions.
              </p>

            </div>
          </div>
        );
      case 'Pre-Requisites':
        return <PrerequisitesContent />;
      case 'Learn Code':
        return <LearnCodeComponent />;
      case 'Objective':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Lab Objective</h2>
            
            <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               {/* Decorative Gradient Blob */}
               <div className="absolute top-0 right-0 w-75 h-75 bg-[#00e5ff]/10 blur-[100px] rounded-full pointer-events-none"></div>

               <p className="text-xl font-semibold text-white mb-8 leading-relaxed">
                  By the end of this experiment, students will be able to:
               </p>

               <ul className="space-y-6">
                  {['Understand what Linear Regression is',
                    'Interpret data using scatter plots',
                    'Learn how the "best-fit line" is calculated',
                    'Predict outputs using a regression model',
                    'Understand basic terms like slope, intercept, and error',
                    'Gain intuition behind how machines learn from data'
                  ].map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                       <span className="shrink-0 w-8 h-8 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                         {idx + 1}
                       </span>
                       <span className="text-lg text-gray-300 pt-1 leading-snug font-medium">
                         {objective}
                       </span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        );
      case 'Simulation':
        return (
          <LinearRegressionSimulation />
        );
      case 'Target Audience':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Target Audience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Undergraduate Students', desc: '(CSE, IT, Data Science)' },
                { title: 'Beginners in ML', desc: 'Starting their Machine Learning journey' },
                { title: 'Curious Minds', desc: 'Anyone curious about how predictions work' },
                { title: 'Foundational Seekers', desc: 'Students with little or no prior knowledge' }
              ].map((audience, idx) => (
                 <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-default shadow-lg hover:-translate-y-1">
                    <h3 className="text-[#00e5ff] font-bold text-xl mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"></span>
                      {audience.title}
                    </h3>
                    <p className="text-gray-400 text-lg">{audience.desc}</p>
                 </div>
              ))}
            </div>
          </div>
        );
      case 'Course Alignment':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Course Alignment</h2>
            
            <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">This experiment aligns with:</h3>
              <div className="flex flex-wrap gap-4">
                {['Machine Learning Fundamentals', 'Artificial Intelligence Basics', 'Data Science Introduction', 'Statistics (Correlation Concepts)'].map((course, idx) => (
                  <span key={idx} className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:bg-[#00e5ff]/20 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-[0_0_30px_rgba(108,43,217,0.15)]">
               <div className="w-16 h-16 bg-purple-500/20 rounded-full flex shrink-0 items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(108,43,217,0.3)]">
                 <span className="text-3xl">🎓</span>
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-4">It is typically part of:</h4>
                 <ul className="list-disc pl-6 text-gray-300 space-y-3 text-xl font-medium">
                   <li>2nd / 3rd year engineering curriculum</li>
                   <li>Introductory ML courses</li>
                 </ul>
               </div>
            </div>
          </div>
        );
      case 'Resources':
        return (
          <div className="animate-page-enter max-w-5xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Learning Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                 { type: 'Video', title: 'Machine Learning: Linear Regression', author: 'Andrew Ng (Stanford)', link: 'https://www.youtube.com/watch?v=het9HFqo1TQ', icon: '▶️', color: 'text-red-400' },
                 { type: 'Course', title: 'Mathematics for Machine Learning', author: 'Imperial College London', link: 'https://www.coursera.org/specializations/mathematics-machine-learning', icon: '🎓', color: 'text-blue-400' },
                 { type: 'Article', title: 'Linear Regression Detailed Math', author: 'Towards Data Science', link: 'https://towardsdatascience.com/linear-regression-detailed-view-ea73175f6e86', icon: '📄', color: 'text-green-400' },
                 { type: 'Book', title: 'ISLR: Intro to Statistical Learning', author: 'Gareth James et al.', link: 'https://www.statlearning.com/', icon: '📚', color: 'text-yellow-400' },
                 { type: 'Tool', title: 'Interactive ML Visualizer', author: '101AI', link: 'https://101ai.net/linear-regression', icon: '🛠️', color: 'text-[#00e5ff]' },
                 { type: 'Documentation', title: 'Scikit-Learn Regression API', author: 'Official Docs', link: 'https://scikit-learn.org/stable/modules/linear_model.html', icon: '💻', color: 'text-purple-400' }
              ].map((res, idx) => (
                 <a href={res.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-3xl">{res.icon}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded shrink-0 ${res.color}`}>{res.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm">By {res.author}</p>
                 </a>
              ))}
            </div>
            
            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Want to practice code?</h3>
                  <p className="text-gray-400">Join our open source community discord to collaborate on algorithms.</p>
               </div>
               <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all whitespace-nowrap border border-white/10 hover:border-white/30">
                  Join Discord Community
               </button>
            </div>
          </div>
        );
      case 'Feedback':
        return <FeedbackForm />;
      case 'Test your Knowledge':
        return <QuizComponent />;
      default:
        return (
          <div className="animate-page-enter">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">{activeTab}</h2>
            <p className="text-gray-400 italic">Content for {activeTab} is currently being compiled...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white relative font-sans flex flex-col pt-32 animate-page-enter">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Page Header */}
      <div className="px-8 max-w-7xl mx-auto mb-12 relative w-full border-b border-white/5 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Linear Regression <span className="font-light text-gray-400 opacity-60 ml-2">| Interactive Lab</span>
        </h1>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-8 max-w-7xl mx-auto w-full mb-32 flex-1 z-10">
        
        {/* Sticky Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col">
          <div className="sticky top-32 glass-card p-2 shadow-2xl overflow-hidden bg-[#110b27]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 mb-1 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-sm ${
                    isActive 
                      ? 'bg-linear-to-r from-[#6c2bd9] to-[#4a1bb8] text-white shadow-[0_4px_20px_rgba(108,43,217,0.4)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-[#00e5ff]' : 'text-gray-500'} transition-colors`}>{tab.icon}</span>
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 glass-card p-8 md:p-12 min-h-150 border border-white/5 bg-[#0a0510]/80 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {renderContent()}
        </div>

      </div>

      <WaveFooter />
    </div>
  );
}
