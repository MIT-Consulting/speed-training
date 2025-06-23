(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();class y{constructor(){this.trainingPlan=null,this.processedData=null,this.videoData=null,this.searchIndex={},this.summaryIndex={},this.keywordIndex={}}async loadTrainingPlan(){try{const e=await fetch("/src/data/training-plan.json");if(!e.ok)throw new Error(`Failed to load training plan: ${e.statusText}`);return this.trainingPlan=await e.json(),this.processData(),this.extractVideoData(),this.buildSearchIndices(),console.log("Training plan loaded successfully:",this.trainingPlan),this.trainingPlan}catch(e){throw console.error("Error loading training plan:",e),e}}processData(){this.trainingPlan&&(this.processedData={meta:{title:this.trainingPlan.program_title,goal:this.trainingPlan.program_goal,description:this.trainingPlan.program_description,totalWeeks:this.trainingPlan.weeks.length,totalDays:this.trainingPlan.weeks.reduce((e,t)=>e+t.days.length,0),totalExercises:this.getTotalExercises()},weeks:this.trainingPlan.weeks.map(e=>this.processWeek(e)),focusAreas:this.getFocusAreas(),exercises:this.getAllExercises(),videos:this.getAllVideos()})}processWeek(e){return{weekNumber:e.week_number,days:e.days.map(t=>this.processDay(t,e.week_number)),totalExercises:e.days.reduce((t,s)=>t+this.getDayExerciseCount(s),0),focusDistribution:this.getWeekFocusDistribution(e)}}processDay(e,t){return{dayNumber:e.day_number,weekNumber:t,focus:e.focus,focusColor:this.getFocusColor(e.focus),notes:e.notes_general_day||"",blocks:e.blocks.map(s=>this.processBlock(s,t,e.day_number)),totalExercises:this.getDayExerciseCount(e),estimatedDuration:this.estimateDayDuration(e),videoCount:this.getDayVideoCount(e)}}processBlock(e,t,s){return{name:e.block_name,exercises:e.exercises.map((i,a)=>this.processExercise(i,e.block_name,t,s,a)),exerciseCount:e.exercises.length}}processExercise(e,t,s,i,a){const r=e.exercise_summary||"";return{id:`w${s}-d${i}-${t.replace(/[^a-zA-Z0-9]/g,"")}-${a}`,name:e.name,setsReps:e.sets_reps||"",notes:e.notes||"",summary:r,summaryPreview:this.getSummaryPreview(r),videoUrl:e.video_url||null,videoId:this.extractVideoId(e.video_url),hasVideo:!!e.video_url,blockName:t,weekNumber:s,dayNumber:i,exerciseIndex:a,estimatedDuration:this.estimateExerciseDuration(e),equipment:this.extractEquipment(e.notes||e.name),focusArea:this.determineFocusAreaFromSummary(r),complexity:this.determineComplexityFromSummary(r),movementTags:this.generateMovementTags(r),keywords:this.extractKeywordsFromSummary(r),readingTime:this.estimateReadingTime(r)}}buildSearchIndices(){this.processedData&&(this.searchIndex={},this.summaryIndex={},this.keywordIndex={},this.processedData.exercises.forEach(e=>{this.indexExercise(e)}))}indexExercise(e){const t=[e.name,e.summary,e.notes].filter(i=>i).join(" ").toLowerCase();this.extractKeywords(t).forEach(i=>{this.keywordIndex[i]||(this.keywordIndex[i]=[]),this.keywordIndex[i].push(e)}),e.summary&&e.summary.toLowerCase().split(/\W+/).forEach(a=>{a.length>2&&(this.summaryIndex[a]||(this.summaryIndex[a]=[]),this.summaryIndex[a].push(e))})}getSummaryPreview(e){return e?e.length>100?e.substring(0,100)+"...":e:""}determineFocusAreaFromSummary(e){if(!e)return"General";const t=e.toLowerCase();return t.includes("acceleration")||t.includes("explosive")||t.includes("starting")?"Acceleration":t.includes("speed")||t.includes("top speed")||t.includes("sprint")?"Speed":t.includes("lateral")||t.includes("agility")||t.includes("direction")||t.includes("cutting")?"Agility":"General"}determineComplexityFromSummary(e){if(!e)return 1;const t=e.toLowerCase();let s=1;return t.includes("advanced")||t.includes("complex")||t.includes("coordination")?s=4:t.includes("multiple")||t.includes("combines")||t.includes("sequence")?s=3:t.includes("basic")||t.includes("simple")||t.includes("fundamental")?s=1:s=2,s}generateMovementTags(e){if(!e)return["General Movement"];const t=e.toLowerCase(),s=[];return(t.includes("jump")||t.includes("hop")||t.includes("bound"))&&s.push("Plyometric"),(t.includes("lateral")||t.includes("sideways")||t.includes("side"))&&s.push("Lateral"),(t.includes("sprint")||t.includes("run")||t.includes("dash"))&&s.push("Sprint"),(t.includes("balance")||t.includes("stability")||t.includes("stable"))&&s.push("Balance"),(t.includes("coordination")||t.includes("rhythm")||t.includes("timing"))&&s.push("Coordination"),(t.includes("power")||t.includes("explosive")||t.includes("force"))&&s.push("Power"),(t.includes("hip")||t.includes("core")||t.includes("trunk"))&&s.push("Core"),(t.includes("reactive")||t.includes("quick")||t.includes("rapid"))&&s.push("Reactive"),s.length>0?s:["General Movement"]}extractKeywordsFromSummary(e){if(!e)return[];const t=["the","a","an","and","or","but","in","on","at","to","for","of","with","by"];return e.toLowerCase().split(/\W+/).filter(s=>s.length>2&&!t.includes(s)).slice(0,10)}estimateReadingTime(e){if(!e)return 0;const t=200,s=e.split(/\s+/).length;return Math.ceil(s/t*60)}semanticSearch(e){if(!e)return[];const t=e.toLowerCase(),s=this.processedData.exercises.filter(n=>n.name.toLowerCase().includes(t)),i=this.processedData.exercises.filter(n=>n.summary&&n.summary.toLowerCase().includes(t)),a=this.searchKeywords(t),r=this.processedData.exercises.filter(n=>n.movementTags.some(o=>o.toLowerCase().includes(t)));return this.rankSearchResults(s,i,a,r,e)}searchKeywords(e){const t=e.split(" "),s=new Set;return t.forEach(i=>{Object.keys(this.keywordIndex).forEach(a=>{a.includes(i)&&this.keywordIndex[a].forEach(r=>s.add(r))})}),Array.from(s)}rankSearchResults(e,t,s,i,a){const r=[],n=new Set;return e.forEach(o=>{n.has(o.id)||(r.push({exercise:o,score:100,matchType:"name",excerpt:this.getSearchExcerpt(o,a)}),n.add(o.id))}),t.forEach(o=>{n.has(o.id)||(r.push({exercise:o,score:80,matchType:"summary",excerpt:this.getSearchExcerpt(o,a)}),n.add(o.id))}),i.forEach(o=>{n.has(o.id)||(r.push({exercise:o,score:70,matchType:"movement",excerpt:this.getSearchExcerpt(o,a)}),n.add(o.id))}),s.forEach(o=>{n.has(o.id)||(r.push({exercise:o,score:60,matchType:"keyword",excerpt:this.getSearchExcerpt(o,a)}),n.add(o.id))}),r.sort((o,c)=>c.score-o.score)}getSearchExcerpt(e,t){const s=e.summary||"",i=t.toLowerCase(),r=s.toLowerCase().indexOf(i);if(r===-1)return s.substring(0,150)+"...";const n=Math.max(0,r-50),o=Math.min(s.length,r+t.length+50);return(n>0?"...":"")+s.substring(n,o)+(o<s.length?"...":"")}findSimilarExercises(e,t=5){if(!e||!this.processedData)return[];const s=[],i=new Set(e.movementTags);return this.processedData.exercises.forEach(a=>{if(a.id===e.id)return;const r=new Set(a.movementTags),n=new Set([...i].filter(d=>r.has(d))),o=new Set([...i,...r]),c=n.size/o.size;c>.2&&s.push({exercise:a,similarity:Math.round(c*100),commonTags:Array.from(n)})}),s.sort((a,r)=>r.similarity-a.similarity).slice(0,t)}extractVideoId(e){if(!e)return null;const t=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,s=e.match(t);return s&&s[2].length===11?s[2]:null}extractVideoData(){this.trainingPlan&&(this.videoData={allVideos:[],videosByFocus:{},videosByWeek:{},uniqueVideos:new Set},this.trainingPlan.weeks.forEach(e=>{e.days.forEach(t=>{t.blocks.forEach(s=>{s.exercises.forEach(i=>{if(i.video_url){const a={url:i.video_url,videoId:this.extractVideoId(i.video_url),exerciseName:i.name,exerciseSummary:i.exercise_summary||"",focus:t.focus,weekNumber:e.week_number,dayNumber:t.day_number,blockName:s.block_name};this.videoData.allVideos.push(a),this.videoData.videosByFocus[t.focus]||(this.videoData.videosByFocus[t.focus]=[]),this.videoData.videosByFocus[t.focus].push(a);const r=`week${e.week_number}`;this.videoData.videosByWeek[r]||(this.videoData.videosByWeek[r]=[]),this.videoData.videosByWeek[r].push(a),this.videoData.uniqueVideos.add(i.video_url)}})})})}))}getFocusColor(e){return{Acceleration:"var(--acceleration)","Top End Speed":"var(--speed)","Change of Direction/Lateral Movements/Agility":"var(--agility)"}[e]||"var(--gray-500)"}getFocusAreas(){if(!this.trainingPlan)return[];const e=new Set;return this.trainingPlan.weeks.forEach(t=>{t.days.forEach(s=>{e.add(s.focus)})}),Array.from(e)}getAllExercises(){if(!this.processedData)return[];const e=[];return this.processedData.weeks.forEach(t=>{t.days.forEach(s=>{s.blocks.forEach(i=>{e.push(...i.exercises)})})}),e}getAllVideos(){return this.videoData?this.videoData.allVideos:[]}getWeek(e){return this.processedData?this.processedData.weeks.find(t=>t.weekNumber===e):null}getDay(e,t){const s=this.getWeek(e);return s?s.days.find(i=>i.dayNumber===t):null}getExercise(e){if(!this.processedData)return null;for(const t of this.processedData.weeks)for(const s of t.days)for(const i of s.blocks){const a=i.exercises.find(r=>r.id===e);if(a)return a}return null}searchExercises(e){return this.semanticSearch(e).map(t=>t.exercise)}filterExercises(e){if(!this.processedData)return[];let t=this.processedData.exercises;return e.focus&&(t=t.filter(s=>{const i=this.getDay(s.weekNumber,s.dayNumber);return i&&i.focus===e.focus})),e.hasVideo!==void 0&&(t=t.filter(s=>s.hasVideo===e.hasVideo)),e.week&&(t=t.filter(s=>s.weekNumber===e.week)),e.equipment&&(t=t.filter(s=>s.equipment.includes(e.equipment))),e.complexity&&(t=t.filter(s=>s.complexity===e.complexity)),e.movementTag&&(t=t.filter(s=>s.movementTags.includes(e.movementTag))),t}getProgramStats(){return this.processedData?{totalWeeks:this.processedData.meta.totalWeeks,totalDays:this.processedData.meta.totalDays,totalExercises:this.processedData.meta.totalExercises,totalVideos:this.videoData?this.videoData.uniqueVideos.size:0,focusAreas:this.processedData.focusAreas.length,estimatedDuration:this.getEstimatedProgramDuration(),exercisesByFocus:this.getExercisesByFocus(),complexityDistribution:this.getComplexityDistribution(),movementTagDistribution:this.getMovementTagDistribution()}:null}getComplexityDistribution(){const e={1:0,2:0,3:0,4:0};return this.processedData.exercises.forEach(t=>{e[t.complexity]++}),e}getMovementTagDistribution(){const e={};return this.processedData.exercises.forEach(t=>{t.movementTags.forEach(s=>{e[s]=(e[s]||0)+1})}),e}extractKeywords(e){const t=["the","a","an","and","or","but","in","on","at","to","for","of","with","by"];return e.split(/\W+/).filter(s=>s.length>2&&!t.includes(s)).map(s=>s.toLowerCase())}getTotalExercises(){if(!this.trainingPlan)return 0;let e=0;return this.trainingPlan.weeks.forEach(t=>{t.days.forEach(s=>{s.blocks.forEach(i=>{e+=i.exercises.length})})}),e}getTotalWeeks(){return this.trainingPlan?this.trainingPlan.weeks.length:0}getDayExerciseCount(e){return e.blocks.reduce((t,s)=>t+s.exercises.length,0)}getDayVideoCount(e){let t=0;return e.blocks.forEach(s=>{s.exercises.forEach(i=>{i.video_url&&t++})}),t}getWeekFocusDistribution(e){const t={};return e.days.forEach(s=>{t[s.focus]=(t[s.focus]||0)+1}),t}estimateExerciseDuration(e){const t=e.sets_reps||"";return t.includes("3x")?3:t.includes("2x")?2:t.includes("x4")?4:t.includes("x5")?5:2}estimateDayDuration(e){let t=0;return e.blocks.forEach(s=>{s.exercises.forEach(i=>{t+=this.estimateExerciseDuration(i)})}),Math.max(30,t)}getEstimatedProgramDuration(){if(!this.processedData)return 0;let e=0;return this.processedData.weeks.forEach(t=>{t.days.forEach(s=>{e+=s.estimatedDuration})}),Math.round(e/60*10)/10}getExercisesByFocus(){if(!this.processedData)return{};const e={};return this.processedData.exercises.forEach(t=>{const s=this.getDay(t.weekNumber,t.dayNumber);s&&(e[s.focus]||(e[s.focus]=0),e[s.focus]++)}),e}extractEquipment(e){const t=[],s=e.toLowerCase();return s.includes("hurdle")&&t.push("hurdles"),s.includes("cone")&&t.push("cones"),s.includes("wall")&&t.push("wall"),s.includes("timer")&&t.push("timer"),s.includes("partner")&&t.push("partner"),(s.includes("medicine ball")||s.includes("medball"))&&t.push("medicine ball"),s.includes("band")&&t.push("resistance band"),(s.includes("box")||s.includes("bench"))&&t.push("box/bench"),t}getVideosByFocus(e){return this.videoData?this.videoData.videosByFocus[e]||[]:[]}getVideosByWeek(e){const t=`week${e}`;return this.videoData?this.videoData.videosByWeek[t]||[]:[]}isValidVideoUrl(e){return e?/^https:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(e):!1}getEmbedUrl(e,t={}){const s=this.extractVideoId(e);if(!s)return null;const i=new URLSearchParams({enablejsapi:"1",origin:window.location.origin,rel:"0",modestbranding:"1",...t});return`https://www.youtube.com/embed/${s}?${i.toString()}`}}class u{constructor(){this.storageKey="speed-training-progress",this.analyticsKey="speed-training-analytics",this.data=this.loadProgress(),this.analytics=this.loadAnalytics()}loadProgress(){try{const e=localStorage.getItem(this.storageKey),t=e?JSON.parse(e):this.getDefaultProgressData(),s=this.getDefaultProgressData();return{...s,...t,overall:{...s.overall,...t.overall||{}}}}catch(e){return console.error("Error loading progress data:",e),this.getDefaultProgressData()}}loadAnalytics(){try{const e=localStorage.getItem(this.analyticsKey);return e?JSON.parse(e):this.getDefaultAnalyticsData()}catch(e){return console.error("Error loading analytics data:",e),this.getDefaultAnalyticsData()}}getDefaultProgressData(){return{exercises:{},weeks:{},days:{},overall:{startDate:null,lastActiveDate:null,totalTimeSpent:0,streak:0,longestStreak:0}}}getDefaultAnalyticsData(){return{summaryReads:{},videoWatches:{},masteryProgression:{},timeSpent:{},searchQueries:[],featureUsage:{}}}saveProgress(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.data))}catch(e){console.error("Error saving progress data:",e)}}saveAnalytics(){try{localStorage.setItem(this.analyticsKey,JSON.stringify(this.analytics))}catch(e){console.error("Error saving analytics data:",e)}}getExerciseProgress(e){return this.data.exercises[e]||null}updateExerciseProgress(e,t){this.data.exercises[e]||(this.data.exercises[e]={completed:!1,videoWatched:!1,summaryRead:!1,masteryLevel:0,timeSpent:0,firstCompleted:null,lastCompleted:null,completionCount:0});const s=this.data.exercises[e];Object.assign(s,t),t.completed&&!s.completed?(s.firstCompleted=Date.now(),s.completionCount=1):t.completed&&(s.lastCompleted=Date.now(),s.completionCount=(s.completionCount||0)+1),t.masteryLevel!==void 0&&this.trackMasteryProgression(e,t.masteryLevel),this.updateOverallProgress(),this.saveProgress()}trackMasteryProgression(e,t){this.analytics.masteryProgression[e]||(this.analytics.masteryProgression[e]=[]),this.analytics.masteryProgression[e].push({level:t,timestamp:Date.now()}),this.saveAnalytics()}trackSummaryRead(e,t=0){var i;this.analytics.summaryReads[e]||(this.analytics.summaryReads[e]={count:0,firstRead:Date.now(),totalTime:0,sessions:[]});const s=this.analytics.summaryReads[e];s.count++,s.totalTime+=t,s.sessions.push({timestamp:Date.now(),duration:t}),this.updateExerciseProgress(e,{summaryRead:!0,timeSpent:(((i=this.data.exercises[e])==null?void 0:i.timeSpent)||0)+t}),this.saveAnalytics()}trackVideoWatch(e,t,s=0,i=!1){var r;this.analytics.videoWatches[e]||(this.analytics.videoWatches[e]={count:0,firstWatch:Date.now(),totalDuration:0,completions:0,sessions:[]});const a=this.analytics.videoWatches[e];a.count++,a.totalDuration+=s,i&&a.completions++,a.sessions.push({timestamp:Date.now(),duration:s,completed:i,exerciseId:t}),t&&this.updateExerciseProgress(t,{videoWatched:!0,timeSpent:(((r=this.data.exercises[t])==null?void 0:r.timeSpent)||0)+s}),this.saveAnalytics()}trackSearchQuery(e,t=0){this.analytics.searchQueries.push({query:e,timestamp:Date.now(),resultCount:t}),this.analytics.searchQueries.length>100&&(this.analytics.searchQueries=this.analytics.searchQueries.slice(-100)),this.saveAnalytics()}trackFeatureUsage(e,t="use"){const s=`${e}_${t}`;this.analytics.featureUsage[s]||(this.analytics.featureUsage[s]={count:0,firstUse:Date.now(),lastUse:Date.now()}),this.analytics.featureUsage[s].count++,this.analytics.featureUsage[s].lastUse=Date.now(),this.saveAnalytics()}updateOverallProgress(){this.data.overall||(this.data.overall={startDate:null,lastActiveDate:null,totalTimeSpent:0,streak:0,longestStreak:0}),this.data.overall.startDate||(this.data.overall.startDate=Date.now()),this.data.overall.lastActiveDate=Date.now(),this.calculateStreak()}calculateStreak(){this.data.overall||(this.data.overall={startDate:null,lastActiveDate:null,totalTimeSpent:0,streak:0,longestStreak:0});const e=Object.values(this.data.exercises).filter(i=>i.completed);if(e.length===0){this.data.overall.streak=0;return}e.sort((i,a)=>(a.lastCompleted||a.firstCompleted)-(i.lastCompleted||i.firstCompleted));let t=0,s=new Date;s.setHours(0,0,0,0);for(const i of e){const a=new Date(i.lastCompleted||i.firstCompleted);if(a.setHours(0,0,0,0),Math.floor((s-a)/(1e3*60*60*24))<=1)t++,s.setDate(s.getDate()-1);else break}this.data.overall.streak=t,this.data.overall.longestStreak=Math.max(this.data.overall.longestStreak||0,t)}getWeekProgress(e){return this.data.weeks[e]||{completed:!1,exercisesCompleted:0,totalExercises:0,startDate:null,completionDate:null}}updateWeekProgress(e,t){this.data.weeks[e]||(this.data.weeks[e]=this.getWeekProgress(e)),Object.assign(this.data.weeks[e],t),this.saveProgress()}getDayProgress(e,t){const s=`w${e}-d${t}`;return this.data.days[s]||{completed:!1,exercisesCompleted:0,totalExercises:0,startDate:null,completionDate:null,timeSpent:0}}updateDayProgress(e,t,s){const i=`w${e}-d${t}`;this.data.days[i]||(this.data.days[i]=this.getDayProgress(e,t)),Object.assign(this.data.days[i],s),this.saveProgress()}calculateOverallCompletion(e){const t=Object.values(this.data.exercises).filter(s=>s.completed).length;return e>0?Math.round(t/e*100):0}calculateWeekCompletion(e,t){const s=t.filter(a=>a.weekNumber===e),i=s.filter(a=>{var r;return(r=this.data.exercises[a.id])==null?void 0:r.completed}).length;return s.length>0?Math.round(i/s.length*100):0}calculateDayCompletion(e,t,s){const i=s.filter(r=>r.weekNumber===e&&r.dayNumber===t),a=i.filter(r=>{var n;return(n=this.data.exercises[r.id])==null?void 0:n.completed}).length;return i.length>0?Math.round(a/i.length*100):0}getContentEngagementStats(){const e=this.analytics.summaryReads||{},t=this.analytics.videoWatches||{},s=Object.entries(e).map(([i,a])=>({exerciseId:i,readCount:a.count,avgTimeSpent:a.totalTime/a.count,totalTimeSpent:a.totalTime}));return{totalSummariesRead:Object.keys(e).length,totalVideoWatches:Object.values(t).reduce((i,a)=>i+a.count,0),averageTimePerSummary:this.calculateAverageTime(e),mostReadExercises:s.sort((i,a)=>a.readCount-i.readCount).slice(0,10),longestStudiedExercises:s.sort((i,a)=>a.totalTimeSpent-i.totalTimeSpent).slice(0,10),videoCompletionRate:this.calculateVideoCompletionRate(t)}}calculateAverageTime(e){const t=Object.values(e).reduce((s,i)=>({time:s.time+i.totalTime,count:s.count+i.count}),{time:0,count:0});return t.count>0?Math.round(t.time/t.count):0}calculateVideoCompletionRate(e){const t=Object.values(e).reduce((s,i)=>({watches:s.watches+i.count,completions:s.completions+i.completions}),{watches:0,completions:0});return t.watches>0?Math.round(t.completions/t.watches*100):0}generateLearningInsights(){this.data.overall||(this.data.overall={startDate:null,lastActiveDate:null,totalTimeSpent:0,streak:0,longestStreak:0},this.saveProgress());const e=this.getContentEngagementStats(),t=[];e.averageTimePerSummary>60&&t.push({type:"positive",icon:"📚",message:"Great job taking time to understand each exercise thoroughly!",detail:`You spend an average of ${Math.round(e.averageTimePerSummary)}s reading exercise descriptions.`}),e.totalSummariesRead>50&&t.push({type:"achievement",icon:"🏆",message:"Exercise Explorer: You've read over 50 exercise descriptions!",detail:"Your dedication to learning proper technique is impressive."}),e.videoCompletionRate>80&&t.push({type:"positive",icon:"🎥",message:"Video Champion: You complete most of the videos you start!",detail:`${e.videoCompletionRate}% video completion rate shows great focus.`}),this.data.overall.streak>0&&t.push({type:"streak",icon:"🔥",message:`${this.data.overall.streak} day streak!`,detail:this.data.overall.streak===1?"Keep it going!":"You're building great habits!"});const s=Object.values(this.data.exercises).filter(i=>i.masteryLevel>=4).length;return s>10&&t.push({type:"mastery",icon:"⭐",message:`Master of ${s} exercises!`,detail:"Your technique proficiency is excellent."}),t}getProgressChartData(){return{weeklyCompletion:this.getWeeklyCompletionData(),masteryDistribution:this.getMasteryDistributionData(),engagementTrends:this.getEngagementTrendsData(),streakHistory:this.getStreakHistoryData()}}getWeeklyCompletionData(){const e=[];for(let t=1;t<=6;t++){const s=this.getWeekProgress(t);e.push({week:t,completion:s.exercisesCompleted/(s.totalExercises||1)*100,exercisesCompleted:s.exercisesCompleted,totalExercises:s.totalExercises})}return e}getMasteryDistributionData(){const e={0:0,1:0,2:0,3:0,4:0,5:0};return Object.values(this.data.exercises).forEach(t=>{e[t.masteryLevel||0]++}),e}getEngagementTrendsData(){return{summaryReads:Object.keys(this.analytics.summaryReads).length,videoWatches:Object.values(this.analytics.videoWatches).reduce((e,t)=>e+t.count,0),searchQueries:this.analytics.searchQueries.length}}getStreakHistoryData(){return{current:this.data.overall.streak,longest:this.data.overall.longestStreak,history:[]}}exportProgress(){return{progress:this.data,analytics:this.analytics,exportDate:Date.now(),version:"1.0"}}importProgress(e){try{return e.progress&&(this.data={...this.getDefaultProgressData(),...e.progress},this.saveProgress()),e.analytics&&(this.analytics={...this.getDefaultAnalyticsData(),...e.analytics},this.saveAnalytics()),!0}catch(t){return console.error("Error importing progress data:",t),!1}}resetProgress(){this.data=this.getDefaultProgressData(),this.analytics=this.getDefaultAnalyticsData(),this.saveProgress(),this.saveAnalytics()}}class g{constructor(){this.storageKey="speed-training-theme",this.themes=["light","dark","system"],this.currentTheme=this.loadTheme(),this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.mediaQuery.addEventListener("change",this.handleSystemThemeChange.bind(this)),this.applyTheme(),this.updateThemeIcon()}loadTheme(){try{const e=localStorage.getItem(this.storageKey);if(e&&this.themes.includes(e))return e}catch(e){console.error("Error loading theme:",e)}return"system"}saveTheme(){try{localStorage.setItem(this.storageKey,this.currentTheme)}catch(e){console.error("Error saving theme:",e)}}getEffectiveTheme(){return this.currentTheme==="system"?this.mediaQuery.matches?"dark":"light":this.currentTheme}applyTheme(){const e=this.getEffectiveTheme();document.documentElement.setAttribute("data-theme",e),document.body.classList.remove("theme-light","theme-dark"),document.body.classList.add(`theme-${e}`),this.dispatchThemeChangeEvent(e)}toggleTheme(){const e=["light","dark","system"],s=(e.indexOf(this.currentTheme)+1)%e.length;this.setTheme(e[s])}setTheme(e){if(!this.themes.includes(e)){console.warn(`Invalid theme: ${e}`);return}this.currentTheme=e,this.applyTheme(),this.saveTheme(),this.updateThemeIcon(),this.addTransition()}handleSystemThemeChange(){this.currentTheme==="system"&&(this.applyTheme(),this.updateThemeIcon())}updateThemeIcon(){const e=document.getElementById("theme-toggle"),t=document.querySelector(".theme-icon");if(!t)return;this.getEffectiveTheme();const s={light:"🌙",dark:"☀️",system:"🔄"},i=["light","dark","system"],r=(i.indexOf(this.currentTheme)+1)%i.length,n=i[r];if(t.textContent=s[n],e){const o={light:"Switch to dark mode",dark:"Switch to system theme",system:"Switch to light mode"};e.setAttribute("aria-label",o[n]),e.setAttribute("title",o[n])}}addTransition(){const e=document.createElement("style");e.textContent=`
      *, *::before, *::after {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
      }
    `,document.head.appendChild(e),setTimeout(()=>{document.head.removeChild(e)},300)}dispatchThemeChangeEvent(e){const t=new CustomEvent("themechange",{detail:{theme:this.currentTheme,effectiveTheme:e,isDark:e==="dark"}});document.dispatchEvent(t)}getCurrentTheme(){return this.currentTheme}isDarkMode(){return this.getEffectiveTheme()==="dark"}isLightMode(){return this.getEffectiveTheme()==="light"}isSystemTheme(){return this.currentTheme==="system"}getSystemPreference(){return this.mediaQuery.matches?"dark":"light"}forceUpdate(){this.applyTheme(),this.updateThemeIcon()}resetToSystem(){this.setTheme("system")}getThemeStats(){return{currentTheme:this.currentTheme,effectiveTheme:this.getEffectiveTheme(),systemPreference:this.getSystemPreference(),isDark:this.isDarkMode(),isLight:this.isLightMode(),isSystem:this.isSystemTheme(),supportsSystemDetection:!!window.matchMedia}}addEventListener(e){document.addEventListener("themechange",e)}removeEventListener(e){document.removeEventListener("themechange",e)}destroy(){this.mediaQuery&&this.mediaQuery.removeEventListener("change",this.handleSystemThemeChange.bind(this))}}class v{constructor(e,t){this.dataProcessor=e,this.container=t,this.searchInput=null,this.resultsContainer=null,this.currentResults=[],this.currentFilters={},this.searchTimeout=null,this.isActive=!1,this.init()}init(){this.createSearchInterface(),this.attachEventListeners()}createSearchInterface(){this.container.innerHTML=`
      <div class="search-wrapper">
        <div class="search-input-container">
          <input type="text" 
                 class="search-input" 
                 id="exercise-search" 
                 placeholder="Search exercises, movements, or descriptions..."
                 autocomplete="off"
                 spellcheck="false">
          <div class="search-icons">
            <button class="search-clear" id="search-clear" style="display: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner-small"></div>
            </div>
          </div>
        </div>
        
        <div class="search-filters" id="search-filters" style="display: none;">
          <div class="filter-group">
            <label>Focus Area:</label>
            <select id="focus-filter">
              <option value="">All Areas</option>
              <option value="Acceleration">Acceleration</option>
              <option value="Speed">Speed</option>
              <option value="Agility">Agility</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Complexity:</label>
            <select id="complexity-filter">
              <option value="">All Levels</option>
              <option value="1">Level 1 (Beginner)</option>
              <option value="2">Level 2 (Developing)</option>
              <option value="3">Level 3 (Intermediate)</option>
              <option value="4">Level 4 (Advanced)</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Equipment:</label>
            <select id="equipment-filter">
              <option value="">Any Equipment</option>
              <option value="hurdles">Hurdles</option>
              <option value="cones">Cones</option>
              <option value="wall">Wall</option>
              <option value="medicine ball">Medicine Ball</option>
              <option value="resistance band">Resistance Band</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Video:</label>
            <select id="video-filter">
              <option value="">All Exercises</option>
              <option value="true">With Video</option>
              <option value="false">Without Video</option>
            </select>
          </div>
          
          <button class="clear-filters-btn" id="clear-filters">Clear Filters</button>
        </div>
        
        <div class="search-suggestions" id="search-suggestions" style="display: none;">
          <div class="suggestions-header">
            <span>Popular searches:</span>
          </div>
          <div class="suggestions-list">
            <button class="suggestion-tag" data-query="sprint">Sprint</button>
            <button class="suggestion-tag" data-query="jump">Jump</button>
            <button class="suggestion-tag" data-query="lateral">Lateral</button>
            <button class="suggestion-tag" data-query="explosive">Explosive</button>
            <button class="suggestion-tag" data-query="coordination">Coordination</button>
            <button class="suggestion-tag" data-query="plyometric">Plyometric</button>
          </div>
        </div>
        
        <div class="search-results" id="search-results" style="display: none;">
          <div class="results-header" id="results-header">
            <span class="results-count">0 results</span>
            <button class="toggle-filters-btn" id="toggle-filters">
              <span>Filters</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
          </div>
          <div class="results-list" id="results-list">
            <!-- Search results will be populated here -->
          </div>
        </div>
      </div>
    `,this.searchInput=this.container.querySelector("#exercise-search"),this.resultsContainer=this.container.querySelector("#search-results"),this.resultsList=this.container.querySelector("#results-list"),this.resultsHeader=this.container.querySelector("#results-header"),this.resultsCount=this.container.querySelector(".results-count")}attachEventListeners(){this.searchInput.addEventListener("input",a=>{this.handleSearchInput(a.target.value)}),this.searchInput.addEventListener("focus",()=>{this.showSuggestions()}),this.searchInput.addEventListener("blur",a=>{setTimeout(()=>{this.container.contains(document.activeElement)||this.hideSuggestions()},200)}),this.container.querySelector("#search-clear").addEventListener("click",()=>{this.clearSearch()}),this.container.querySelector("#toggle-filters").addEventListener("click",()=>{this.toggleFilters()}),this.container.querySelector("#clear-filters").addEventListener("click",()=>{this.clearFilters()}),this.attachFilterListeners(),this.container.querySelectorAll(".suggestion-tag").forEach(a=>{a.addEventListener("click",()=>{const r=a.getAttribute("data-query");this.executeSearch(r)})}),document.addEventListener("click",a=>{this.container.contains(a.target)||(this.hideSuggestions(),this.hideResults())})}attachFilterListeners(){["focus-filter","complexity-filter","equipment-filter","video-filter"].forEach(t=>{const s=this.container.querySelector(`#${t}`);s&&s.addEventListener("change",()=>{this.updateFilters(),this.performSearch()})})}handleSearchInput(e){this.searchTimeout&&clearTimeout(this.searchTimeout);const t=this.container.querySelector("#search-clear");if(t.style.display=e.length>0?"block":"none",e.length===0){this.showSuggestions(),this.hideResults();return}else this.hideSuggestions();this.searchTimeout=setTimeout(()=>{this.performSearch(e)},300),e.length>2&&this.showLoading()}performSearch(e=null){const t=e||this.searchInput.value.trim();if(t.length===0){this.hideResults();return}this.showLoading(),this.dataProcessor.progressTracker&&this.dataProcessor.progressTracker.trackSearchQuery(t);const s=this.dataProcessor.semanticSearch(t),i=this.applyFilters(s);this.currentResults=i,this.displayResults(i,t),this.hideLoading()}applyFilters(e){return e.filter(t=>{const s=t.exercise;return!(this.currentFilters.focus&&s.focusArea!==this.currentFilters.focus||this.currentFilters.complexity&&s.complexity!==parseInt(this.currentFilters.complexity)||this.currentFilters.equipment&&!s.equipment.includes(this.currentFilters.equipment)||this.currentFilters.video==="true"&&!s.hasVideo||this.currentFilters.video==="false"&&s.hasVideo)})}updateFilters(){this.currentFilters={focus:this.container.querySelector("#focus-filter").value,complexity:this.container.querySelector("#complexity-filter").value,equipment:this.container.querySelector("#equipment-filter").value,video:this.container.querySelector("#video-filter").value}}displayResults(e,t){this.resultsCount.textContent=`${e.length} result${e.length!==1?"s":""}`,e.length===0?this.resultsList.innerHTML=`
        <div class="no-results">
          <p>No exercises found for "${t}"</p>
          <div class="search-suggestions-inline">
            <p>Try searching for:</p>
            <div class="suggestion-tags">
              <button class="suggestion-tag" data-query="acceleration">Acceleration</button>
              <button class="suggestion-tag" data-query="agility">Agility</button>
              <button class="suggestion-tag" data-query="plyometric">Plyometric</button>
            </div>
          </div>
        </div>
      `:this.resultsList.innerHTML=e.map(s=>this.createResultItem(s,t)).join(""),this.showResults(),this.attachResultListeners()}createResultItem(e,t){const s=e.exercise,i=this.getMatchTypeIcon(e.matchType),a="★".repeat(s.complexity)+"☆".repeat(4-s.complexity);return`
      <div class="search-result-item" data-exercise-id="${s.id}">
        <div class="result-header">
          <div class="result-title">
            <span class="match-type-icon">${i}</span>
            <h4 class="exercise-title">${this.highlightQuery(s.name,t)}</h4>
            <div class="result-meta">
              <span class="complexity-badge level-${s.complexity}">${a}</span>
              <span class="focus-badge" data-focus="${s.focusArea}">${s.focusArea}</span>
              ${s.hasVideo?'<span class="video-badge">🎥</span>':""}
            </div>
          </div>
          <button class="view-exercise-btn" data-exercise-id="${s.id}">
            View Exercise
          </button>
        </div>
        
        <div class="result-content">
          <div class="result-excerpt">
            <p>${this.highlightQuery(e.excerpt,t)}</p>
          </div>
          
          <div class="result-details">
            <div class="exercise-info">
              ${s.setsReps?`<span class="sets-reps">📋 ${s.setsReps}</span>`:""}
              <span class="reading-time">📖 ${s.readingTime}s read</span>
              <span class="week-day">📅 Week ${s.weekNumber}, Day ${s.dayNumber}</span>
            </div>
            
            <div class="movement-tags">
              ${s.movementTags.map(r=>`<span class="movement-tag">${this.highlightQuery(r,t)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `}getMatchTypeIcon(e){return{name:"🎯",summary:"📖",movement:"🏃",keyword:"🔍"}[e]||"🔍"}highlightQuery(e,t){if(!t||!e)return e;const s=new RegExp(`(${t})`,"gi");return e.replace(s,'<mark class="search-highlight">$1</mark>')}attachResultListeners(){this.resultsList.querySelectorAll(".view-exercise-btn").forEach(i=>{i.addEventListener("click",a=>{a.stopPropagation();const r=i.getAttribute("data-exercise-id");this.navigateToExercise(r)})}),this.resultsList.querySelectorAll(".search-result-item").forEach(i=>{i.addEventListener("click",()=>{const a=i.getAttribute("data-exercise-id");this.navigateToExercise(a)})}),this.resultsList.querySelectorAll(".suggestion-tag").forEach(i=>{i.addEventListener("click",a=>{a.stopPropagation();const r=i.getAttribute("data-query");this.executeSearch(r)})})}navigateToExercise(e){document.dispatchEvent(new CustomEvent("navigateToExercise",{detail:{exerciseId:e}})),this.hideResults()}executeSearch(e){this.searchInput.value=e,this.hideSuggestions(),this.performSearch(e)}clearSearch(){this.searchInput.value="",this.hideResults(),this.showSuggestions();const e=this.container.querySelector("#search-clear");e.style.display="none"}clearFilters(){["focus-filter","complexity-filter","equipment-filter","video-filter"].forEach(t=>{const s=this.container.querySelector(`#${t}`);s&&(s.value="")}),this.currentFilters={},this.performSearch()}toggleFilters(){const e=this.container.querySelector("#search-filters"),t=this.container.querySelector("#toggle-filters"),s=e.style.display!=="none";e.style.display=s?"none":"block",t.classList.toggle("active",!s)}showSuggestions(){const e=this.container.querySelector("#search-suggestions");this.searchInput.value.length===0&&(e.style.display="block")}hideSuggestions(){const e=this.container.querySelector("#search-suggestions");e.style.display="none"}showResults(){this.resultsContainer.style.display="block",this.isActive=!0}hideResults(){this.resultsContainer.style.display="none",this.isActive=!1}showLoading(){const e=this.container.querySelector("#search-loading");e.style.display="block"}hideLoading(){const e=this.container.querySelector("#search-loading");e.style.display="none"}getSearchState(){return{query:this.searchInput.value,filters:this.currentFilters,results:this.currentResults,isActive:this.isActive}}setSearchQuery(e){this.searchInput.value=e,this.performSearch(e)}getPopularSearches(){return["sprint","jump","lateral","explosive","coordination","plyometric","acceleration","agility","balance","power"]}exportSearchData(){return{recentSearches:[],popularSearches:this.getPopularSearches(),currentState:this.getSearchState()}}destroy(){this.searchTimeout&&clearTimeout(this.searchTimeout),document.removeEventListener("click",this.handleDocumentClick),this.container.innerHTML=""}}class f{constructor(e,t,s={}){this.videoUrl=e,this.container=t,this.options={autoplay:!1,controls:!0,modestbranding:!0,rel:0,enablejsapi:1,...s},this.player=null,this.videoId=this.extractVideoId(e),this.isLoaded=!1,this.isPlaying=!1,this.duration=0,this.currentTime=0,this.onReady=null,this.onStateChange=null,this.onVideoEnd=null,this.onProgress=null,this.init()}async init(){if(!this.videoId||!this.container){console.error("Invalid video URL or container");return}this.createPlayerContainer(),await this.loadYouTubeAPI(),this.createPlayer()}createPlayerContainer(){this.container.innerHTML=`
      <div class="video-player-wrapper">
        <div class="video-player-loading" id="loading-${this.videoId}">
          <div class="loading-spinner"></div>
          <p>Loading video...</p>
        </div>
        <div class="video-player-iframe" id="player-${this.videoId}"></div>
        <div class="video-player-overlay" id="overlay-${this.videoId}">
          <button class="video-play-button" id="play-btn-${this.videoId}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Play Video</span>
          </button>
        </div>
        <div class="video-player-error" id="error-${this.videoId}" style="display: none;">
          <p>Unable to load video. Please check your connection and try again.</p>
          <button class="retry-btn" id="retry-${this.videoId}">Retry</button>
        </div>
      </div>
    `;const e=this.container.querySelector(`#overlay-${this.videoId}`),t=this.container.querySelector(`#play-btn-${this.videoId}`),s=this.container.querySelector(`#retry-${this.videoId}`);e&&e.addEventListener("click",()=>this.loadAndPlay()),t&&t.addEventListener("click",i=>{i.stopPropagation(),this.loadAndPlay()}),s&&s.addEventListener("click",()=>this.retry())}loadYouTubeAPI(){return new Promise((e,t)=>{if(window.YT&&window.YT.Player){e();return}if(window.YTScriptLoading){const i=()=>{window.YT&&window.YT.Player?e():setTimeout(i,100)};i();return}window.YTScriptLoading=!0;const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api",s.async=!0,window.onYouTubeIframeAPIReady=()=>{window.YTScriptLoading=!1,e()},s.onerror=()=>{window.YTScriptLoading=!1,t(new Error("Failed to load YouTube API"))},document.head.appendChild(s)})}createPlayer(){if(!window.YT||!window.YT.Player){console.error("YouTube API not loaded"),this.showError();return}try{this.player=new window.YT.Player(`player-${this.videoId}`,{height:"315",width:"560",videoId:this.videoId,playerVars:{...this.options,origin:window.location.origin},events:{onReady:this.onPlayerReady.bind(this),onStateChange:this.onPlayerStateChange.bind(this),onError:this.onPlayerError.bind(this)}})}catch(e){console.error("Error creating YouTube player:",e),this.showError()}}onPlayerReady(e){this.isLoaded=!0,this.duration=this.player.getDuration();const t=this.container.querySelector(`#loading-${this.videoId}`);t&&(t.style.display="none");const s=this.container.querySelector(`#overlay-${this.videoId}`);s&&(s.style.display="none");const i=this.container.querySelector(`#player-${this.videoId}`);i&&(i.style.display="block"),this.startProgressTracking(),this.onReady&&this.onReady(e),console.log("Video player ready:",this.videoId)}onPlayerStateChange(e){switch(e.data){case window.YT.PlayerState.PLAYING:this.isPlaying=!0;break;case window.YT.PlayerState.PAUSED:this.isPlaying=!1;break;case window.YT.PlayerState.ENDED:this.isPlaying=!1,this.onVideoEnd&&this.onVideoEnd();break;case window.YT.PlayerState.BUFFERING:break}this.onStateChange&&this.onStateChange(e)}onPlayerError(e){console.error("YouTube player error:",e.data),this.showError()}showError(){const e=this.container.querySelector(`#loading-${this.videoId}`),t=this.container.querySelector(`#overlay-${this.videoId}`),s=this.container.querySelector(`#error-${this.videoId}`);e&&(e.style.display="none"),t&&(t.style.display="none"),s&&(s.style.display="block")}async loadAndPlay(){if(!this.isLoaded){const e=this.container.querySelector(`#overlay-${this.videoId}`),t=this.container.querySelector(`#loading-${this.videoId}`);e&&(e.style.display="none"),t&&(t.style.display="block"),await this.waitForPlayerReady()}this.player&&this.player.playVideo&&this.player.playVideo()}waitForPlayerReady(){return new Promise(e=>{const t=()=>{this.isLoaded?e():setTimeout(t,100)};t()})}retry(){const e=this.container.querySelector(`#error-${this.videoId}`),t=this.container.querySelector(`#overlay-${this.videoId}`);e&&(e.style.display="none"),t&&(t.style.display="block"),this.isLoaded=!1,this.player=null,this.createPlayer()}startProgressTracking(){this.progressInterval=setInterval(()=>{if(this.player&&this.isPlaying)try{this.currentTime=this.player.getCurrentTime(),this.onProgress&&this.onProgress({currentTime:this.currentTime,duration:this.duration,percentage:this.currentTime/this.duration*100})}catch{}},1e3)}stopProgressTracking(){this.progressInterval&&(clearInterval(this.progressInterval),this.progressInterval=null)}extractVideoId(e){if(!e)return null;const t=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,s=e.match(t);return s&&s[2].length===11?s[2]:null}play(){this.player&&this.player.playVideo?this.player.playVideo():this.loadAndPlay()}pause(){this.player&&this.player.pauseVideo&&this.player.pauseVideo()}stop(){this.player&&this.player.stopVideo&&this.player.stopVideo()}seekTo(e){this.player&&this.player.seekTo&&this.player.seekTo(e,!0)}setVolume(e){this.player&&this.player.setVolume&&this.player.setVolume(Math.max(0,Math.min(100,e)))}getCurrentTime(){return this.player&&this.player.getCurrentTime?this.player.getCurrentTime():0}getDuration(){return this.player&&this.player.getDuration?this.player.getDuration():this.duration}getVideoUrl(){return this.player&&this.player.getVideoUrl?this.player.getVideoUrl():this.videoUrl}enterFullscreen(){const e=this.container.querySelector(`#player-${this.videoId}`);e&&(e.requestFullscreen?e.requestFullscreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen())}exitFullscreen(){document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}toggleFullscreen(){document.fullscreenElement?this.exitFullscreen():this.enterFullscreen()}setPlaybackRate(e){this.player&&this.player.setPlaybackRate&&this.player.setPlaybackRate(e)}getAvailablePlaybackRates(){return this.player&&this.player.getAvailablePlaybackRates?this.player.getAvailablePlaybackRates():[.25,.5,.75,1,1.25,1.5,1.75,2]}mute(){this.player&&this.player.mute&&this.player.mute()}unMute(){this.player&&this.player.unMute&&this.player.unMute()}isMuted(){return this.player&&this.player.isMuted?this.player.isMuted():!1}getVideoTitle(){return this.player&&this.player.getVideoData&&this.player.getVideoData().title||"Exercise Demonstration"}getThumbnailUrl(e="mqdefault"){return this.videoId?`https://img.youtube.com/vi/${this.videoId}/${e}.jpg`:null}isVideoPlaying(){return this.isPlaying}isVideoLoaded(){return this.isLoaded}getPlayerState(){return this.player&&this.player.getPlayerState?this.player.getPlayerState():-1}addEventListener(e,t){switch(e){case"ready":this.onReady=t;break;case"statechange":this.onStateChange=t;break;case"ended":this.onVideoEnd=t;break;case"progress":this.onProgress=t;break}}removeEventListener(e){switch(e){case"ready":this.onReady=null;break;case"statechange":this.onStateChange=null;break;case"ended":this.onVideoEnd=null;break;case"progress":this.onProgress=null;break}}resize(e,t){this.player&&this.player.setSize&&this.player.setSize(e,t)}updateVideo(e){const t=this.extractVideoId(e);t&&t!==this.videoId&&(this.videoUrl=e,this.videoId=t,this.player&&this.player.loadVideoById?this.player.loadVideoById(this.videoId):(this.destroy(),this.init()))}destroy(){if(this.stopProgressTracking(),this.player&&this.player.destroy)try{this.player.destroy()}catch(e){console.warn("Error destroying YouTube player:",e)}this.container&&(this.container.innerHTML=""),this.player=null,this.isLoaded=!1,this.isPlaying=!1,this.onReady=null,this.onStateChange=null,this.onVideoEnd=null,this.onProgress=null}getEmbedUrl(e={}){if(!this.videoId)return null;const t=new URLSearchParams({enablejsapi:"1",origin:window.location.origin,rel:"0",modestbranding:"1",...this.options,...e});return`https://www.youtube.com/embed/${this.videoId}?${t.toString()}`}createThumbnail(){return`
      <div class="video-thumbnail" onclick="this.loadAndPlay()">
        <img src="${this.getThumbnailUrl()}" alt="Video thumbnail" loading="lazy">
        <div class="play-overlay">
          <svg width="68" height="48" viewBox="0 0 68 48">
            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
          </svg>
        </div>
      </div>
    `}}class p{constructor(e,t,s){this.exercise=e,this.blockName=t,this.dataProcessor=s,this.completed=!1,this.activeTab="summary",this.videoWatched=!1,this.summaryRead=!1,this.masteryLevel=0,this.progressTracker=new u,this.videoPlayer=null,this.loadProgress()}loadProgress(){const e=this.progressTracker.getExerciseProgress(this.exercise.id);e&&(this.completed=e.completed||!1,this.videoWatched=e.videoWatched||!1,this.summaryRead=e.summaryRead||!1,this.masteryLevel=e.masteryLevel||0)}saveProgress(){this.progressTracker.updateExerciseProgress(this.exercise.id,{completed:this.completed,videoWatched:this.videoWatched,summaryRead:this.summaryRead,masteryLevel:this.masteryLevel,lastUpdated:Date.now()})}render(){const e=document.createElement("div");return e.className=`exercise-card ${this.completed?"completed":""}`,e.setAttribute("data-mastery",this.masteryLevel),e.setAttribute("data-exercise-id",this.exercise.id),e.innerHTML=`
      <div class="exercise-header">
        <h4 class="exercise-name">${this.exercise.name}</h4>
        <div class="exercise-meta">
          <span class="mastery-indicator" title="Mastery Level: ${this.masteryLevel}/5">
            ${"★".repeat(this.masteryLevel)}${"☆".repeat(5-this.masteryLevel)}
          </span>
          <button class="complete-btn" data-completed="${this.completed}">
            ${this.completed?"✓":"○"}
          </button>
        </div>
      </div>
      
      <div class="exercise-preview">
        <p class="summary-preview">${this.getSummaryPreview()}</p>
        ${this.exercise.setsReps?`<span class="sets-reps-badge">${this.exercise.setsReps}</span>`:""}
        <div class="exercise-indicators">
          <span class="complexity-indicator level-${this.exercise.complexity}">
            Level ${this.exercise.complexity}/4
          </span>
          <span class="focus-area-indicator" data-focus="${this.exercise.focusArea}">
            ${this.exercise.focusArea}
          </span>
          ${this.exercise.hasVideo?'<span class="video-indicator">🎥</span>':""}
        </div>
      </div>
      
      <div class="exercise-tabs">
        <button class="tab ${this.activeTab==="summary"?"active":""}" 
                data-tab="summary">
          📖 Summary ${this.summaryRead?"✓":""}
        </button>
        ${this.exercise.hasVideo?`
          <button class="tab ${this.activeTab==="video"?"active":""}" 
                  data-tab="video">
            📹 Video ${this.videoWatched?"✓":""}
          </button>
        `:""}
        <button class="tab ${this.activeTab==="details"?"active":""}" 
                data-tab="details">⚙️ Details</button>
        <button class="tab ${this.activeTab==="notes"?"active":""}" 
                data-tab="notes">📝 Notes</button>
      </div>
      
      <div class="exercise-content">
        ${this.renderTabContent()}
      </div>
      
      <div class="exercise-actions">
        ${this.renderActionButtons()}
      </div>
    `,this.attachEventListeners(e),e}getSummaryPreview(){const e=this.exercise.summary||"";return e.length>100?e.substring(0,100)+"...":e}renderTabContent(){switch(this.activeTab){case"summary":return this.renderSummaryTab();case"video":return this.renderVideoTab();case"details":return this.renderDetailsTab();case"notes":return this.renderNotesTab();default:return""}}renderSummaryTab(){return`
      <div class="exercise-summary-content">
        <div class="full-summary">
          <p class="exercise-summary">${this.exercise.summary||"No summary available"}</p>
        </div>
        ${this.exercise.summary?`
          <div class="summary-actions">
            <button class="read-aloud-btn" data-action="read-aloud">
              🔊 Read Aloud
            </button>
            <button class="highlight-btn" data-action="highlight">
              🖍️ Highlight
            </button>
            <button class="bookmark-btn" data-action="bookmark">
              🔖 Bookmark
            </button>
          </div>
          <div class="reading-stats">
            <span class="reading-time">📖 ${this.exercise.readingTime}s read</span>
            <span class="word-count">${this.getWordCount()} words</span>
          </div>
        `:""}
        <div class="exercise-metadata">
          <div class="movement-tags">
            ${this.exercise.movementTags.map(e=>`<span class="movement-tag">${e}</span>`).join("")}
          </div>
        </div>
      </div>
    `}renderVideoTab(){return this.exercise.hasVideo?`
      <div class="video-container">
        <div class="video-summary-sync">
          <button class="sync-btn" data-action="sync-video-summary">
            🔗 Sync with Summary
          </button>
        </div>
        <div class="video-player-container" id="video-player-${this.exercise.id}">
          <!-- Video player will be inserted here -->
        </div>
        <div class="video-controls">
          <button class="video-bookmark" data-action="bookmark-video">
            🔖 Bookmark
          </button>
          <button class="video-fullscreen" data-action="fullscreen">
            ⛶ Fullscreen
          </button>
          <button class="video-summary-overlay" data-action="show-summary-overlay">
            📖 Show Summary Overlay
          </button>
        </div>
        <div class="video-info">
          <p class="video-description">Watch the demonstration for proper form and technique.</p>
        </div>
      </div>
    `:'<p class="no-video">No video demonstration available for this exercise.</p>'}renderDetailsTab(){return`
      <div class="exercise-details">
        <div class="sets-reps-detail">
          <h5>Sets & Reps</h5>
          <p class="sets-reps">${this.exercise.setsReps||"Not specified"}</p>
        </div>
        ${this.exercise.notes?`
          <div class="exercise-notes-detail">
            <h5>Coaching Notes</h5>
            <p class="exercise-notes">${this.exercise.notes}</p>
          </div>
        `:""}
        <div class="exercise-analysis">
          <h5>Movement Analysis</h5>
          <div class="movement-tags">
            ${this.exercise.movementTags.map(e=>`<span class="movement-tag">${e}</span>`).join("")}
          </div>
        </div>
        ${this.exercise.equipment.length>0?`
          <div class="equipment-needed">
            <h5>Equipment Needed</h5>
            <div class="equipment-list">
              ${this.exercise.equipment.map(e=>`<span class="equipment-item">${e}</span>`).join("")}
            </div>
          </div>
        `:""}
        <div class="difficulty-assessment">
          <h5>Difficulty Assessment</h5>
          <div class="mastery-controls">
            <label>Rate your mastery (1-5):</label>
            <div class="star-rating">
              ${[1,2,3,4,5].map(e=>`
                <button class="star ${e<=this.masteryLevel?"filled":""}" 
                        data-mastery="${e}">★</button>
              `).join("")}
            </div>
            <p class="mastery-description">${this.getMasteryDescription()}</p>
          </div>
        </div>
      </div>
    `}renderNotesTab(){const e=this.getPersonalNotes(),t=this.getRelatedExercises();return`
      <div class="personal-notes-section">
        <textarea class="personal-notes" 
                  placeholder="Add your personal notes and observations...">${e}</textarea>
        <div class="notes-actions">
          <button class="save-notes-btn" data-action="save-notes">
            💾 Save Notes
          </button>
          <button class="voice-notes-btn" data-action="voice-note">
            🎤 Voice Note
          </button>
        </div>
        <div class="related-exercises">
          <h5>Related Exercises</h5>
          <div class="related-list">
            ${t.map(s=>`
              <div class="related-item" data-exercise-id="${s.exercise.id}">
                <span class="related-name">${s.exercise.name}</span>
                <span class="related-similarity">${s.similarity}% similar</span>
                <div class="related-tags">
                  ${s.commonTags.map(i=>`<span class="common-tag">${i}</span>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}renderActionButtons(){return`
      <div class="action-buttons">
        <button class="mark-complete-btn ${this.completed?"completed":""}" 
                data-action="toggle-completion">
          ${this.completed?"✅ Completed":"⭕ Mark Complete"}
        </button>
        <button class="find-similar-btn" data-action="find-similar">
          🔍 Find Similar
        </button>
        <button class="share-btn" data-action="share">
          📤 Share
        </button>
      </div>
    `}attachEventListeners(e){e.querySelectorAll(".tab").forEach(s=>{s.addEventListener("click",i=>{const a=i.target.getAttribute("data-tab");this.switchTab(a,e)})}),e.addEventListener("click",s=>{const i=s.target.getAttribute("data-action");i&&(s.preventDefault(),this.handleAction(i,s.target,e))}),e.querySelectorAll(".star").forEach(s=>{s.addEventListener("click",i=>{const a=parseInt(i.target.getAttribute("data-mastery"));this.setMastery(a,e)})}),e.querySelector(".complete-btn").addEventListener("click",()=>{this.toggleCompletion(e)});const t=e.querySelector(".personal-notes");t&&t.addEventListener("input",()=>{this.autoSaveNotes(t.value)})}switchTab(e,t){this.activeTab=e,t.querySelectorAll(".tab").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-tab")===e)});const s=t.querySelector(".exercise-content");s.innerHTML=this.renderTabContent(),e==="video"&&this.exercise.hasVideo&&this.initializeVideoPlayer(t),e==="summary"&&!this.summaryRead&&this.markSummaryAsRead(t),this.attachTabSpecificListeners(t)}initializeVideoPlayer(e){const t=e.querySelector(`#video-player-${this.exercise.id}`);t&&this.exercise.videoUrl&&(this.videoPlayer=new f(this.exercise.videoUrl,t),this.videoPlayer.onVideoEnd=()=>{this.markVideoAsWatched(e)})}markSummaryAsRead(e){this.summaryRead=!0,this.saveProgress();const t=e.querySelector('[data-tab="summary"]');t&&!t.textContent.includes("✓")&&(t.innerHTML="📖 Summary ✓")}markVideoAsWatched(e){this.videoWatched=!0,this.saveProgress();const t=e.querySelector('[data-tab="video"]');t&&!t.textContent.includes("✓")&&(t.innerHTML="📹 Video ✓")}handleAction(e,t,s){switch(e){case"read-aloud":this.readAloud();break;case"highlight":this.toggleHighlight(t);break;case"bookmark":this.bookmarkExercise();break;case"sync-video-summary":this.syncVideoWithSummary();break;case"toggle-completion":this.toggleCompletion(s);break;case"find-similar":this.showSimilarExercises();break;case"share":this.shareExercise();break;case"save-notes":this.saveNotes(s);break;case"voice-note":this.recordVoiceNote();break}}toggleCompletion(e){this.completed=!this.completed,this.saveProgress(),e.classList.toggle("completed",this.completed);const t=e.querySelector(".complete-btn");t.textContent=this.completed?"✓":"○",t.setAttribute("data-completed",this.completed);const s=e.querySelector(".mark-complete-btn");s.textContent=this.completed?"✅ Completed":"⭕ Mark Complete",s.classList.toggle("completed",this.completed),e.dispatchEvent(new CustomEvent("exerciseCompleted",{detail:{exercise:this.exercise,completed:this.completed}}))}setMastery(e,t){this.masteryLevel=e,this.saveProgress(),t.querySelectorAll(".star").forEach((a,r)=>{a.classList.toggle("filled",r<e)});const s=t.querySelector(".mastery-indicator");s.innerHTML="★".repeat(e)+"☆".repeat(5-e),s.setAttribute("title",`Mastery Level: ${e}/5`);const i=t.querySelector(".mastery-description");i&&(i.textContent=this.getMasteryDescription())}getMasteryDescription(){const e={0:"Not started",1:"Beginner - Learning the basics",2:"Developing - Can perform with guidance",3:"Competent - Can perform independently",4:"Proficient - Consistent performance",5:"Expert - Can teach others"};return e[this.masteryLevel]||e[0]}getWordCount(){return this.exercise.summary?this.exercise.summary.split(/\s+/).length:0}readAloud(){if("speechSynthesis"in window&&this.exercise.summary){const e=new SpeechSynthesisUtterance(this.exercise.summary);e.rate=.8,e.pitch=1,speechSynthesis.speak(e)}}getPersonalNotes(){return localStorage.getItem(`exercise-notes-${this.exercise.id}`)||""}autoSaveNotes(e){localStorage.setItem(`exercise-notes-${this.exercise.id}`,e)}saveNotes(e){const t=e.querySelector(".personal-notes");if(t){this.autoSaveNotes(t.value);const s=e.querySelector(".save-notes-btn"),i=s.textContent;s.textContent="✅ Saved",setTimeout(()=>{s.textContent=i},2e3)}}getRelatedExercises(){return this.dataProcessor?this.dataProcessor.findSimilarExercises(this.exercise,3):[]}showSimilarExercises(){const e=this.getRelatedExercises();document.dispatchEvent(new CustomEvent("showSimilarExercises",{detail:{exercise:this.exercise,similarExercises:e}}))}shareExercise(){if(navigator.share)navigator.share({title:`Speed Training Exercise: ${this.exercise.name}`,text:this.exercise.summary||this.exercise.name,url:window.location.href});else{const e=`${this.exercise.name}

${this.exercise.summary||""}`;navigator.clipboard.writeText(e).then(()=>{console.log("Exercise copied to clipboard")})}}bookmarkExercise(){const e=JSON.parse(localStorage.getItem("exercise-bookmarks")||"[]"),t=e.includes(this.exercise.id);if(t){const s=e.indexOf(this.exercise.id);e.splice(s,1)}else e.push(this.exercise.id);localStorage.setItem("exercise-bookmarks",JSON.stringify(e)),console.log(t?"Exercise unbookmarked":"Exercise bookmarked")}syncVideoWithSummary(){console.log("Syncing video with summary...")}recordVoiceNote(){console.log("Recording voice note...")}toggleHighlight(e){e.classList.toggle("highlighted"),console.log("Toggled highlight")}attachTabSpecificListeners(e){e.querySelectorAll(".star").forEach(i=>{i.addEventListener("click",a=>{const r=parseInt(a.target.getAttribute("data-mastery"));this.setMastery(r,e)})}),e.querySelectorAll(".related-item").forEach(i=>{i.addEventListener("click",()=>{const a=i.getAttribute("data-exercise-id");document.dispatchEvent(new CustomEvent("navigateToExercise",{detail:{exerciseId:a}}))})})}updateExercise(e){this.exercise={...this.exercise,...e}}destroy(){this.videoPlayer&&this.videoPlayer.destroy()}}class k{constructor(e,t){this.dataProcessor=e,this.progressTracker=t,this.container=document.getElementById("week-content"),this.currentWeek=1,this.collapseStates=this.loadCollapseStates(),this.initializeKeyboardShortcuts()}initializeDefaultStates(e){const t=new Date,s=this.getCurrentDayIndex(t);this.collapseStates[e]||(this.collapseStates[e]={days:{},exerciseBlocks:{}});const i=this.dataProcessor.getWeek(e);i&&(i.days.forEach((a,r)=>{const n=`day_${r}`;this.collapseStates[e].days[n]===void 0&&(this.collapseStates[e].days[n]=!(r===s||r===s+1)),this.collapseStates[e].exerciseBlocks[n]||(this.collapseStates[e].exerciseBlocks[n]={warmup:!1,blockA:!1,blockB:!1,blockC:!1,blockD:!1})}),this.saveCollapseStates())}render(){this.container&&this.showWeek(this.currentWeek)}showWeek(e){this.currentWeek=e,this.initializeDefaultStates(e);const t=this.dataProcessor.getWeek(e);t&&(this.renderWeekView(t),this.setupEventListeners())}renderWeekView(e){const t=this.getWeekProgress(e),s=this.getWeekFocus(e),i=`
      <div class="week-view" data-week="${e.weekNumber}">
        <div class="week-header">
          <h2 class="week-title">Week ${e.weekNumber}</h2>
          <div class="week-stats">
            <span class="week-progress">${t}% Complete</span>
            <span class="week-focus">${s}</span>
          </div>
        </div>
        
        <div class="week-controls">
          <div class="global-collapse-controls">
            <button class="global-control-btn expand-all" 
                    title="Expand All Sections (Ctrl+E)"
                    aria-label="Expand all days and exercise blocks">
              📖 Expand All
            </button>
            <button class="global-control-btn collapse-all" 
                    title="Collapse All Sections (Ctrl+C)"
                    aria-label="Collapse all days and exercise blocks">
              📁 Collapse All
            </button>
            <button class="global-control-btn smart-view" 
                    title="Smart View: Show current and upcoming workouts"
                    aria-label="Apply smart view showing relevant days">
              🎯 Smart View
            </button>
          </div>
          
          <div class="view-options">
            <button class="view-toggle compact-view" 
                    title="Toggle Compact View">
              📋 Compact
            </button>
            <button class="view-toggle summary-view" 
                    title="Toggle Summary View">
              📝 Summary
            </button>
          </div>
        </div>
        
        <div class="week-days">
          ${e.days.map((a,r)=>this.renderDay(a,r,e.weekNumber)).join("")}
        </div>
        
        <div class="week-summary-stats">
          ${this.renderWeekSummary(e)}
        </div>
      </div>
    `;this.container.innerHTML=i}renderDay(e,t,s){const i=`day_${t}`,a=this.collapseStates[s].days[i],r=this.getDayProgress(e,s),n=this.getDayName(t);return`
      <div class="day-section ${a?"collapsed":"expanded"}" data-day="${t}">
        <div class="day-header" 
             tabindex="0"
             role="button"
             aria-expanded="${!a}"
             aria-controls="day-content-${t}">
          
          <div class="day-title-section">
            <span class="collapse-indicator ${a?"collapsed":"expanded"}" 
                  aria-hidden="true">
              ${a?"▶":"▼"}
            </span>
            <h3 class="day-title">${n}</h3>
            <span class="day-date">${this.getDayDate(t)}</span>
          </div>
          
          <div class="day-meta">
            <div class="day-progress-indicator">
              <span class="progress-text">${r}%</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${r}%"></div>
              </div>
            </div>
            <span class="day-focus-badge" data-focus="${e.focus}">${this.getDayFocus(e)}</span>
            <span class="exercise-count">${this.getTotalExercises(e)} exercises</span>
          </div>
        </div>
        
        <div class="day-content" 
             id="day-content-${t}"
             style="${a?"display: none;":""}"
             aria-hidden="${a}">
          
          <div class="day-exercise-blocks">
            ${this.renderExerciseBlocks(e,t,s)}
          </div>
          
          <div class="day-actions">
            <button class="day-action-btn mark-day-complete ${r===100?"completed":""}"
                    data-action="toggle-day-completion" data-day="${t}">
              ${r===100?"✅ Day Complete":"⭕ Mark Day Complete"}
            </button>
            <button class="day-action-btn collapse-day-blocks"
                    data-action="collapse-day-blocks" data-day="${t}">
              📁 Collapse Blocks
            </button>
            <button class="day-action-btn expand-day-blocks"
                    data-action="expand-day-blocks" data-day="${t}">
              📖 Expand Blocks
            </button>
          </div>
        </div>
      </div>
    `}renderExerciseBlocks(e,t,s){const i=["warmup","blockA","blockB","blockC","blockD"],a=`day_${t}`;return i.map(r=>{const n=e[r]||[];if(n.length===0)return"";const o=this.collapseStates[s].exerciseBlocks[a][r],c=this.getBlockProgress(n,s,t),d=this.getBlockTitle(r);return`
        <div class="exercise-block ${o?"collapsed":"expanded"}" 
             data-block="${r}">
          
          <div class="block-header"
               tabindex="0"
               role="button"
               aria-expanded="${!o}"
               aria-controls="block-content-${t}-${r}">
            
            <div class="block-title-section">
              <span class="block-collapse-indicator ${o?"collapsed":"expanded"}"
                    aria-hidden="true">
                ${o?"▶":"▼"}
              </span>
              <h4 class="block-title">${d}</h4>
              <span class="block-exercise-count">(${n.length} exercises)</span>
            </div>
            
            <div class="block-meta">
              <div class="block-progress">
                <span class="block-progress-text">${c}%</span>
                <div class="block-progress-bar">
                  <div class="block-progress-fill" style="width: ${c}%"></div>
                </div>
              </div>
              <span class="estimated-time">${this.getBlockEstimatedTime(n)}</span>
            </div>
          </div>
          
          <div class="block-content"
               id="block-content-${t}-${r}"
               style="${o?"display: none;":""}"
               aria-hidden="${o}">
            
            <div class="exercise-list">
              ${n.map(h=>this.renderExerciseCardContainer(h,r)).join("")}
            </div>
          </div>
        </div>
      `}).join("")}renderExerciseCardContainer(e,t){return`<div class="exercise-card-container" data-exercise-id="${e.id}"></div>`}renderWeekSummary(e){const t=this.getTotalWeekExercises(e),s=this.getCompletedWeekExercises(e),i=this.getFocusDistribution(e);return`
      <div class="week-summary">
        <h4>Week ${e.weekNumber} Summary</h4>
        
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Exercises:</span>
            <span class="stat-value">${t}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed:</span>
            <span class="stat-value">${s}/${t}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Estimated Time:</span>
            <span class="stat-value">${this.getWeekEstimatedTime(e)}</span>
          </div>
        </div>
        
        <div class="focus-distribution">
          <h5>Focus Areas</h5>
          <div class="focus-chart">
            ${Object.entries(i).map(([a,r])=>`
              <div class="focus-item">
                <span class="focus-label">${a}:</span>
                <div class="focus-bar">
                  <div class="focus-fill focus-${a.toLowerCase().replace(/\s+/g,"-")}" 
                       style="width: ${r}%"></div>
                </div>
                <span class="focus-percentage">${r}%</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}setupEventListeners(){var e,t,s;this.container.querySelectorAll(".day-header").forEach((i,a)=>{i.addEventListener("click",()=>this.toggleDay(a)),i.addEventListener("keydown",r=>this.handleDayKeydown(r,a))}),this.container.querySelectorAll(".block-header").forEach(i=>{const a=parseInt(i.closest(".day-section").dataset.day),r=i.closest(".exercise-block").dataset.block;i.addEventListener("click",()=>this.toggleBlock(a,r)),i.addEventListener("keydown",n=>this.handleBlockKeydown(n,a,r))}),(e=this.container.querySelector(".expand-all"))==null||e.addEventListener("click",()=>this.expandAll()),(t=this.container.querySelector(".collapse-all"))==null||t.addEventListener("click",()=>this.collapseAll()),(s=this.container.querySelector(".smart-view"))==null||s.addEventListener("click",()=>this.applySmartView()),this.container.querySelectorAll("[data-action]").forEach(i=>{i.addEventListener("click",a=>this.handleDayAction(a))}),this.initializeExerciseCards()}initializeExerciseCards(){const e=this.dataProcessor.getWeek(this.currentWeek);e&&e.days.forEach((t,s)=>{["warmup","blockA","blockB","blockC","blockD"].forEach(a=>{(t[a]||[]).forEach(n=>{const o=this.container.querySelector(`[data-exercise-id="${n.id}"]`);if(o){const c=new p(n,a,this.dataProcessor);o.appendChild(c.render())}})})})}toggleDay(e){const t=`day_${e}`,s=this.collapseStates[this.currentWeek].days[t];this.collapseStates[this.currentWeek].days[t]=!s,this.saveCollapseStates(),this.updateDayDisplay(e),this.announceToggle(`Day ${e+1}`,s?"expanded":"collapsed")}toggleBlock(e,t){const s=`day_${e}`,i=this.collapseStates[this.currentWeek].exerciseBlocks[s][t];this.collapseStates[this.currentWeek].exerciseBlocks[s][t]=!i,this.saveCollapseStates(),this.updateBlockDisplay(e,t),this.announceToggle(`${this.getBlockTitle(t)}`,i?"expanded":"collapsed")}expandAll(){const e=this.dataProcessor.getWeek(this.currentWeek);e&&(e.days.forEach((t,s)=>{const i=`day_${s}`;this.collapseStates[this.currentWeek].days[i]=!1,Object.keys(this.collapseStates[this.currentWeek].exerciseBlocks[i]).forEach(a=>{this.collapseStates[this.currentWeek].exerciseBlocks[i][a]=!1})}),this.saveCollapseStates(),this.updateAllDisplays(),this.announceToggle("All sections","expanded"))}collapseAll(){const e=this.dataProcessor.getWeek(this.currentWeek);e&&(e.days.forEach((t,s)=>{const i=`day_${s}`;this.collapseStates[this.currentWeek].days[i]=!0,Object.keys(this.collapseStates[this.currentWeek].exerciseBlocks[i]).forEach(a=>{this.collapseStates[this.currentWeek].exerciseBlocks[i][a]=!0})}),this.saveCollapseStates(),this.updateAllDisplays(),this.announceToggle("All sections","collapsed"))}applySmartView(){const e=this.dataProcessor.getWeek(this.currentWeek);if(!e)return;const t=new Date,s=this.getCurrentDayIndex(t);e.days.forEach((i,a)=>{const r=`day_${a}`,n=this.getDayProgress(i,this.currentWeek);a===s||a===s+1?(this.collapseStates[this.currentWeek].days[r]=!1,Object.keys(this.collapseStates[this.currentWeek].exerciseBlocks[r]).forEach(o=>{this.collapseStates[this.currentWeek].exerciseBlocks[r][o]=!1})):n===100?this.collapseStates[this.currentWeek].days[r]=!0:this.collapseStates[this.currentWeek].days[r]=!0}),this.saveCollapseStates(),this.updateAllDisplays(),this.announceToggle("Smart view","applied")}handleDayAction(e){const t=e.target.dataset.action,s=parseInt(e.target.dataset.day);switch(t){case"toggle-day-completion":this.toggleDayCompletion(s);break;case"collapse-day-blocks":this.collapseDayBlocks(s);break;case"expand-day-blocks":this.expandDayBlocks(s);break}}updateDayDisplay(e){const t=this.container.querySelector(`[data-day="${e}"]`),s=t==null?void 0:t.querySelector(`#day-content-${e}`),i=t==null?void 0:t.querySelector(".collapse-indicator"),a=this.collapseStates[this.currentWeek].days[`day_${e}`];t&&s&&i&&(t.classList.toggle("collapsed",a),t.classList.toggle("expanded",!a),s.style.display=a?"none":"",s.setAttribute("aria-hidden",a),i.classList.toggle("collapsed",a),i.classList.toggle("expanded",!a),i.textContent=a?"▶":"▼",t.querySelector(".day-header").setAttribute("aria-expanded",!a))}updateBlockDisplay(e,t){const s=this.container.querySelector(`[data-day="${e}"] [data-block="${t}"]`),i=s==null?void 0:s.querySelector(`#block-content-${e}-${t}`),a=s==null?void 0:s.querySelector(".block-collapse-indicator"),r=this.collapseStates[this.currentWeek].exerciseBlocks[`day_${e}`][t];s&&i&&a&&(s.classList.toggle("collapsed",r),s.classList.toggle("expanded",!r),i.style.display=r?"none":"",i.setAttribute("aria-hidden",r),a.classList.toggle("collapsed",r),a.classList.toggle("expanded",!r),a.textContent=r?"▶":"▼",s.querySelector(".block-header").setAttribute("aria-expanded",!r))}updateAllDisplays(){const e=this.dataProcessor.getWeek(this.currentWeek);e&&e.days.forEach((t,s)=>{this.updateDayDisplay(s),["warmup","blockA","blockB","blockC","blockD"].forEach(a=>{this.updateBlockDisplay(s,a)})})}handleDayKeydown(e,t){e.key==="Enter"||e.key===" "?(e.preventDefault(),this.toggleDay(t)):e.key==="ArrowDown"?(e.preventDefault(),this.focusNextDay(t)):e.key==="ArrowUp"&&(e.preventDefault(),this.focusPreviousDay(t))}handleBlockKeydown(e,t,s){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.toggleBlock(t,s))}initializeKeyboardShortcuts(){document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey)switch(e.key.toLowerCase()){case"e":e.preventDefault(),this.expandAll();break;case"c":e.preventDefault(),this.collapseAll();break}})}getCurrentDayIndex(e){return Math.min(new Date().getDay(),6)}getDayName(e){return["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"][e]||`Day ${e+1}`}getDayDate(e){const t=new Date,s=new Date(t);return s.setDate(t.getDate()+e),s.toLocaleDateString()}getBlockTitle(e){return{warmup:"Warm-up",blockA:"Block A",blockB:"Block B",blockC:"Block C",blockD:"Block D"}[e]||e}getDayProgress(e,t){return this.progressTracker.getDayProgress(t,e.dayNumber)||0}getDayFocus(e){return e.focus||"General Training"}getTotalExercises(e){return["warmup","blockA","blockB","blockC","blockD"].reduce((s,i)=>{var a;return s+(((a=e[i])==null?void 0:a.length)||0)},0)}getBlockProgress(e,t,s){if(!e.length)return 0;const i=e.filter(a=>{var r;return(r=this.progressTracker.getExerciseProgress(a.id))==null?void 0:r.completed}).length;return Math.round(i/e.length*100)}getBlockEstimatedTime(e){return`${e.reduce((s,i)=>s+(i.estimatedTime||2),0)}min`}getWeekProgress(e){return this.progressTracker.getWeekProgress(e.weekNumber)||0}getWeekFocus(e){const t=e.days.map(i=>i.focus).filter(Boolean);return t.reduce((i,a,r,n)=>n.filter(o=>o===i).length>=n.filter(o=>o===a).length?i:a,t[0])||"Mixed Training"}getTotalWeekExercises(e){return e.days.reduce((t,s)=>t+this.getTotalExercises(s),0)}getCompletedWeekExercises(e){let t=0;return e.days.forEach(s=>{["warmup","blockA","blockB","blockC","blockD"].forEach(a=>{const r=s[a]||[];t+=r.filter(n=>{var o;return(o=this.progressTracker.getExerciseProgress(n.id))==null?void 0:o.completed}).length})}),t}getWeekEstimatedTime(e){const t=e.days.reduce((a,r)=>a+["warmup","blockA","blockB","blockC","blockD"].reduce((o,c)=>{const d=r[c]||[];return o+d.reduce((h,m)=>h+(m.estimatedTime||2),0)},0),0),s=Math.floor(t/60),i=t%60;return s>0?`${s}h ${i}m`:`${i}m`}getFocusDistribution(e){const t={};let s=0;e.days.forEach(a=>{const r=a.focus||"General";t[r]=(t[r]||0)+1,s++});const i={};return Object.keys(t).forEach(a=>{i[a]=Math.round(t[a]/s*100)}),i}collapseDayBlocks(e){const t=`day_${e}`;Object.keys(this.collapseStates[this.currentWeek].exerciseBlocks[t]).forEach(s=>{this.collapseStates[this.currentWeek].exerciseBlocks[t][s]=!0}),this.saveCollapseStates(),this.updateDayBlockDisplays(e)}expandDayBlocks(e){const t=`day_${e}`;Object.keys(this.collapseStates[this.currentWeek].exerciseBlocks[t]).forEach(s=>{this.collapseStates[this.currentWeek].exerciseBlocks[t][s]=!1}),this.saveCollapseStates(),this.updateDayBlockDisplays(e)}updateDayBlockDisplays(e){["warmup","blockA","blockB","blockC","blockD"].forEach(s=>{this.updateBlockDisplay(e,s)})}toggleDayCompletion(e){console.log(`Toggle completion for day ${e}`)}focusNextDay(e){const t=this.container.querySelector(`[data-day="${e+1}"] .day-header`);t&&t.focus()}focusPreviousDay(e){const t=this.container.querySelector(`[data-day="${e-1}"] .day-header`);t&&t.focus()}announceToggle(e,t){const s=document.createElement("div");s.setAttribute("aria-live","polite"),s.setAttribute("aria-atomic","true"),s.className="sr-only",s.textContent=`${e} ${t}`,document.body.appendChild(s),setTimeout(()=>document.body.removeChild(s),1e3)}loadCollapseStates(){const e=localStorage.getItem("weekViewCollapseStates");return e?JSON.parse(e):{}}saveCollapseStates(){localStorage.setItem("weekViewCollapseStates",JSON.stringify(this.collapseStates))}applyFilters(e){console.log("Week view filters applied:",e)}}class b{constructor(){this.dataProcessor=null,this.progressTracker=null,this.themeManager=null,this.search=null,this.exerciseCards=new Map,this.weekView=null,this.currentView="dashboard",this.currentWeek=1,this.currentDay=1,this.init()}async init(){try{this.showLoading(),this.initializeTheme(),await this.initializeCore(),this.initializeComponents(),this.setupEventListeners(),await this.loadInitialContent(),this.hideLoading(),this.showView("dashboard"),console.log("Speed Training App initialized successfully!")}catch(e){console.error("Failed to initialize app:",e),this.showError("Failed to load the application. Please refresh the page.")}}initializeTheme(){this.themeManager=new g}async initializeCore(){this.dataProcessor=new y,await this.dataProcessor.loadTrainingPlan(),this.progressTracker=new u}initializeComponents(){const e=document.querySelector(".nav-section .search-container");e&&(this.search=new v(this.dataProcessor,e)),this.weekView=new k(this.dataProcessor,this.progressTracker),this.updateOverallProgress(),this.populateWeeksNavigation(),this.updateProgramStatistics()}async loadInitialContent(){await this.loadDashboard(),this.preloadWeekContent(1)}async loadDashboard(){const e=this.dataProcessor.getProgramStats(),t=this.progressTracker.getContentEngagementStats(),s=this.progressTracker.generateLearningInsights(),i=document.getElementById("program-stats");i&&(i.innerHTML=`
        <div class="stat-item">
          <div class="stat-value">${e.totalWeeks}</div>
          <div class="stat-label">Weeks</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.totalDays}</div>
          <div class="stat-label">Days</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.totalExercises}</div>
          <div class="stat-label">Exercises</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.totalVideos}</div>
          <div class="stat-label">Videos</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t.totalSummariesRead}</div>
          <div class="stat-label">Summaries Read</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Math.round(t.averageTimePerSummary)}s</div>
          <div class="stat-label">Avg. Read Time</div>
        </div>
      `),this.displayLearningInsights(s),this.updateTrainingCalendar()}displayLearningInsights(e){const t=document.createElement("div");t.className="learning-insights",t.innerHTML=`
      <h3>Your Learning Insights</h3>
      <div class="insights-list">
        ${e.map(i=>`
          <div class="insight-item ${i.type}">
            <span class="insight-icon">${i.icon}</span>
            <div class="insight-content">
              <div class="insight-message">${i.message}</div>
              <div class="insight-detail">${i.detail}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;const s=document.querySelector(".quick-actions-card");s&&e.length>0&&s.parentNode.insertBefore(t,s.nextSibling)}updateTrainingCalendar(){const e=document.getElementById("training-calendar");if(!e)return;const t=[];for(let s=1;s<=6;s++){const i=this.dataProcessor.getWeek(s),a=this.progressTracker.calculateWeekCompletion(s,this.dataProcessor.getAllExercises());t.push({number:s,completion:a,days:i?i.days:[]})}e.innerHTML=`
      <div class="calendar-grid">
        ${t.map(s=>`
          <div class="calendar-week" data-week="${s.number}">
            <div class="week-header">
              <span class="week-title">Week ${s.number}</span>
              <span class="week-completion">${s.completion}%</span>
            </div>
            <div class="week-days">
              ${s.days.map(i=>`
                <div class="calendar-day" data-week="${s.number}" data-day="${i.dayNumber}">
                  <div class="day-number">${i.dayNumber}</div>
                  <div class="day-focus">${i.focus}</div>
                  <div class="day-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${this.progressTracker.calculateDayCompletion(s.number,i.dayNumber,this.dataProcessor.getAllExercises())}%"></div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `,e.addEventListener("click",s=>{const i=s.target.closest(".calendar-day");if(i){const a=parseInt(i.dataset.week),r=parseInt(i.dataset.day);this.showDay(a,r)}})}populateWeeksNavigation(){const e=document.getElementById("weeks-nav");if(!e)return;const t=[];for(let s=1;s<=6;s++){const i=this.progressTracker.calculateWeekCompletion(s,this.dataProcessor.getAllExercises());t.push(`
        <li>
          <a href="#" class="nav-link week-link" data-week="${s}">
            <span class="week-number">Week ${s}</span>
            <span class="week-progress">${i}%</span>
            <div class="progress-bar-mini">
              <div class="progress-fill" style="width: ${i}%"></div>
            </div>
          </a>
        </li>
      `)}e.innerHTML=t.join(""),e.addEventListener("click",s=>{s.preventDefault();const i=s.target.closest(".week-link");if(i){const a=parseInt(i.dataset.week);this.showWeek(a)}})}showWeek(e){this.currentWeek=e,this.showView("week-view"),this.weekView&&this.weekView.showWeek(e)}loadWeekContent(e){const t=this.dataProcessor.getWeek(e);if(!t)return;const s=document.getElementById("week-title");s&&(s.textContent=`Week ${e}`);const i=document.getElementById("week-content");i&&(i.innerHTML=`
      <div class="week-overview">
        <div class="week-stats">
          <div class="stat">
            <span class="stat-value">${t.days.length}</span>
            <span class="stat-label">Training Days</span>
          </div>
          <div class="stat">
            <span class="stat-value">${t.totalExercises}</span>
            <span class="stat-label">Total Exercises</span>
          </div>
          <div class="stat">
            <span class="stat-value">${this.progressTracker.calculateWeekCompletion(e,this.dataProcessor.getAllExercises())}%</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
      </div>
      
      <div class="days-grid">
        ${t.days.map(a=>this.createDayCard(a)).join("")}
      </div>
    `,i.addEventListener("click",a=>{const r=a.target.closest(".day-card");if(r){const n=parseInt(r.dataset.day);this.showDay(e,n)}}))}createDayCard(e){const t=this.progressTracker.calculateDayCompletion(e.weekNumber,e.dayNumber,this.dataProcessor.getAllExercises());return`
      <div class="day-card" data-week="${e.weekNumber}" data-day="${e.dayNumber}">
        <div class="day-header">
          <h3>Day ${e.dayNumber}</h3>
          <span class="completion-badge">${t}%</span>
        </div>
        <div class="day-focus" data-focus="${e.focus}">
          <span class="focus-label">${e.focus}</span>
        </div>
        <div class="day-stats">
          <span class="exercise-count">${e.totalExercises} exercises</span>
          <span class="video-count">${e.videoCount} videos</span>
          <span class="duration">${e.estimatedDuration} min</span>
        </div>
        <div class="day-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${t}%"></div>
          </div>
        </div>
      </div>
    `}showDay(e,t){this.currentWeek=e,this.currentDay=t,this.showView("day-view"),this.loadDayContent(e,t)}loadDayContent(e,t){const s=this.dataProcessor.getDay(e,t);if(!s)return;const i=document.getElementById("day-title"),a=document.getElementById("day-description");i&&(i.textContent=`Day ${t} - ${s.focus}`),a&&(a.textContent=`Focus on ${s.focus.toLowerCase()} training`);const r=document.getElementById("day-content");r&&(this.exerciseCards.clear(),r.innerHTML=`
      <div class="day-overview">
        <div class="day-meta">
          <span class="day-duration">⏱️ ${s.estimatedDuration} minutes</span>
          <span class="exercise-count">📋 ${s.totalExercises} exercises</span>
          <span class="video-count">🎥 ${s.videoCount} videos</span>
        </div>
        ${s.notes?`<div class="day-notes">${s.notes}</div>`:""}
      </div>
      
      <div class="blocks-container">
        ${s.blocks.map(n=>this.createBlockSection(n)).join("")}
      </div>
    `,this.initializeExerciseCards(s))}createBlockSection(e){return`
      <div class="block-section" data-block="${e.name}">
        <div class="block-header">
          <h3 class="block-title">${e.name}</h3>
          <span class="block-count">${e.exerciseCount} exercises</span>
        </div>
        <div class="block-exercises" id="block-${e.name.replace(/[^a-zA-Z0-9]/g,"")}">
          <!-- Exercise cards will be inserted here -->
        </div>
      </div>
    `}initializeExerciseCards(e){e.blocks.forEach(t=>{const s=document.getElementById(`block-${t.name.replace(/[^a-zA-Z0-9]/g,"")}`);s&&t.exercises.forEach(i=>{const a=new p(i,t.name,this.dataProcessor),r=a.render();this.exerciseCards.set(i.id,a),s.appendChild(r)})})}preloadWeekContent(e){const t=this.dataProcessor.getWeek(e);t&&t.days.forEach(s=>{console.log(`Preloaded day ${s.dayNumber} of week ${e}`)})}updateOverallProgress(){const e=this.dataProcessor.getProgramStats().totalExercises,t=this.progressTracker.calculateOverallCompletion(e),s=document.getElementById("overall-progress"),i=document.getElementById("overall-percentage");s&&(s.style.width=`${t}%`),i&&(i.textContent=`${t}%`)}updateProgramStatistics(){const e=this.dataProcessor.getProgramStats();console.log("Program statistics:",e)}setupEventListeners(){const e=document.getElementById("theme-toggle");e&&e.addEventListener("click",()=>{this.themeManager.toggleTheme()}),document.addEventListener("click",o=>{const c=o.target.closest("[data-view]");if(c){o.preventDefault();const d=c.dataset.view;this.showView(d)}});const t=document.getElementById("today-workout"),s=document.getElementById("next-workout"),i=document.getElementById("video-library-btn");t&&t.addEventListener("click",()=>{this.showDay(1,1)}),s&&s.addEventListener("click",()=>{this.showDay(this.currentWeek,Math.min(this.currentDay+1,3))}),i&&i.addEventListener("click",()=>{this.showView("video-library-view")});const a=document.getElementById("prev-week"),r=document.getElementById("next-week");a&&a.addEventListener("click",()=>{this.currentWeek>1&&this.showWeek(this.currentWeek-1)}),r&&r.addEventListener("click",()=>{this.currentWeek<6&&this.showWeek(this.currentWeek+1)});const n=document.getElementById("back-to-week");n&&n.addEventListener("click",()=>{this.showWeek(this.currentWeek)}),document.addEventListener("exerciseCompleted",o=>{this.handleExerciseCompletion(o.detail)}),document.addEventListener("navigateToExercise",o=>{this.navigateToExercise(o.detail.exerciseId)}),document.addEventListener("showSimilarExercises",o=>{this.showSimilarExercises(o.detail)}),document.addEventListener("keydown",o=>{this.handleKeyboardShortcuts(o)})}handleExerciseCompletion(e){this.updateOverallProgress(),this.populateWeeksNavigation(),console.log("Exercise completed:",e)}navigateToExercise(e){const t=this.dataProcessor.getExercise(e);t&&(this.showDay(t.weekNumber,t.dayNumber),setTimeout(()=>{const s=document.querySelector(`[data-exercise-id="${e}"]`);s&&(s.scrollIntoView({behavior:"smooth",block:"center"}),s.classList.add("highlight"),setTimeout(()=>s.classList.remove("highlight"),2e3))},500))}showSimilarExercises(e){console.log("Show similar exercises:",e)}handleKeyboardShortcuts(e){if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();const t=document.getElementById("exercise-search");t&&t.focus()}if(e.key>="1"&&e.key<="6"&&!e.ctrlKey&&!e.metaKey&&!e.target.matches("input, textarea")){const t=parseInt(e.key);this.showWeek(t)}}showView(e){document.querySelectorAll(".view").forEach(r=>{r.classList.remove("active")}),document.querySelectorAll(".nav-link").forEach(r=>{r.classList.remove("active")});const s={dashboard:"dashboard-view","week-view":"week-view","day-view":"day-view","video-library":"video-library-view"}[e]||`${e}-view`,i=document.getElementById(s),a=document.querySelector(`[data-view="${e}"]`);i&&i.classList.add("active"),a&&a.classList.add("active"),this.currentView=e,e==="dashboard"?this.loadDashboard():e==="video-library"&&this.loadVideoLibrary()}loadVideoLibrary(){const e=document.getElementById("video-library-content");if(!e)return;const t=this.dataProcessor.getAllVideos(),s={};t.forEach(i=>{s[i.focus]||(s[i.focus]=[]),s[i.focus].push(i)}),e.innerHTML=`
      <div class="video-library-header">
        <h3>Exercise Demonstration Videos</h3>
        <p>Watch proper form and technique for all exercises</p>
      </div>
      
      ${Object.entries(s).map(([i,a])=>`
        <div class="video-focus-section">
          <h4 class="focus-title" data-focus="${i}">${i}</h4>
          <div class="videos-grid">
            ${a.map(r=>`
              <div class="video-thumbnail-card" data-video="${r.videoId}">
                <div class="video-thumbnail">
                  <img src="https://img.youtube.com/vi/${r.videoId}/mqdefault.jpg" 
                       alt="${r.exerciseName}" loading="lazy">
                  <div class="play-overlay">▶️</div>
                </div>
                <div class="video-info">
                  <h5>${r.exerciseName}</h5>
                  <p>Week ${r.weekNumber}, Day ${r.dayNumber}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    `,e.addEventListener("click",i=>{const a=i.target.closest(".video-thumbnail-card");if(a){const r=a.dataset.video;if(t.find(o=>o.videoId===r)){const o=this.dataProcessor.getAllExercises().find(c=>c.videoId===r);o&&this.navigateToExercise(o.id)}}})}showLoading(){const e=document.getElementById("loading-state");e&&(e.style.display="flex")}hideLoading(){const e=document.getElementById("loading-state");e&&(e.style.display="none")}showError(e){const t=document.getElementById("loading-state");t&&(t.innerHTML=`
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>${e}</p>
          <button onclick="location.reload()" class="retry-btn">Retry</button>
        </div>
      `)}}document.addEventListener("DOMContentLoaded",()=>{window.speedTrainingApp=new b});document.addEventListener("visibilitychange",()=>{document.hidden?console.log("App hidden - pausing performance-intensive operations"):console.log("App visible - resuming operations")});
