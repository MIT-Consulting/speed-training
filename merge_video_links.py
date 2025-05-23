import json
import re

def create_video_mapping():
    """Create a mapping of exercise names to their YouTube URLs"""
    video_mapping = {
        # Daily Warm Up
        "DAILY WARM UP VIDEO TO BE DONE PRIOR TO EACH DAY": "https://www.youtube.com/watch?v=FY0Yrfu3wZc",
        
        # Hurdle Hop Progressions
        "HURDLE HOP Progression": "https://www.youtube.com/watch?v=RU5Fjxrglio",
        
        # Skipping Variations
        "Learn to Skip": "https://youtu.be/6dXVXnTU6IQ",
        "Skips": "https://www.youtube.com/watch?v=6dXVXnTU6IQ",
        "A-Skips": "https://youtu.be/-As5gba51Os",
        "Power Skip": "https://youtu.be/CsFqGt3tg_s",
        "B-SKIP WALKS": "https://www.youtube.com/watch?v=1h4Cr1XA-4Q",
        "B-Skip": "https://www.youtube.com/watch?v=1h4Cr1XA-4Q",
        
        # Lateral Movement
        "Learn to Lateral March": "https://youtu.be/Q-VAsjjspUA",
        "Lateral March": "https://youtu.be/Q-VAsjjspUA",
        "Learn to Lateral A-Skip": "https://youtu.be/FTgfpkjQHCY",
        "Lateral Skips": "https://youtu.be/DWDe9fvOLY0",
        "Lateral alternating A Skip": "https://www.youtube.com/watch?v=Hbu3BOz-4t8",
        
        # Bounds and Jumps
        "45 Degree Bound + Stick": "https://www.youtube.com/watch?v=Zbj5SKZUExw",
        "Mini Bounds": "https://youtu.be/B3ANndQH0bA",
        "Bounds": "https://www.youtube.com/watch?v=qGqzOVKA5TM",
        
        # Dynamic Movements
        "Dynamic Hamstring Carch": "https://youtube.com/shorts/3vGyB_HSCEI?feature=share",
        
        # Broad Jumps
        "No Countermovement Broad Jump + Stick": "https://youtu.be/wjBrhKM90Sg",
        "Continuous Broad Jumps": "https://www.youtube.com/watch?v=AFc5UaDX9EY",
        
        # Vertical Jumps
        "Countermovement Vertical Jump + Stick": "https://youtu.be/xN_9TLVCkwQ",
        "Depth Jump For Height": "https://youtu.be/LygAKWyFj40",
        "Vertical to Broad Jump": "https://youtube.com/shorts/hCPC7YSSSII?feature=share",
        
        # Split Squat Variations
        "Split Squat Jump + Pause": "https://www.youtube.com/watch?v=XtpG2I0YPyA",
        "Split squat jump + Pause": "https://www.youtube.com/watch?v=XtpG2I0YPyA",
        "Rebounding Split Squat Jumps": "https://youtu.be/I4Uu2KnD7IQ",
        
        # Lateral Jumps
        "Lateral Leap to 2 foot stick": "https://youtu.be/DBRKZ-rBySU",
        "Lateral Leap to 1 foot Stick": "https://youtu.be/imUZC92JmHw",
        "Lateral Recollects": "https://www.youtube.com/watch?v=QOUPuOch0wY",
        "Lateral Double Tap Rebounding hops": "https://www.youtube.com/watch?v=L-hmMuFh6Xk",
        "Continuous Lateral Bounds To Vertical Jumps": "https://www.youtube.com/watch?v=1d-BjhXo4Ag",
        
        # Pogos and Reactive Jumps
        "Pogos": "https://youtu.be/5YBzYZPI-iE",
        "Quick Double Tap Pogos": "https://youtube.com/shorts/_VGev7F9cbU?feature=share",
        "Double hop jump + Reach": "https://www.youtube.com/watch?v=ZZcpQdPji6k",
        "Double Tap + Quick Switch Jump": "https://youtu.be/D4Ah3EEnEpo",
        
        # Rotational and Complex Jumps
        "90 Degree Jump + Stick": "https://youtu.be/Dh2xEBucIn8",
        "Rotational Jump Sequence": "https://youtu.be/-JmC5Nf4Fdc",
        "Depth Jump to 2 Broad Jumps": "https://youtube.com/shorts/lgifddQQVsk?feature=share",
        
        # Wall Drills
        "Wall Tension ISO holds": "https://youtu.be/H5sA2jxJyjI",
        "Wall Drill-Quick Switches": "https://youtu.be/UnCN82vSQ8M",
        
        # Sprint Variations
        "Rolling (walk in sprints)": "https://www.youtube.com/watch?v=nwuZOplwCBk",
        "Backwards Sprint": "https://www.youtube.com/watch?v=Uu0CK4Nnkqc",
        "Backward Sprint": "https://www.youtube.com/watch?v=Uu0CK4Nnkqc",
        "Crossover Sprints": "https://www.youtube.com/watch?v=qtbswmXBKXY",
        "Single Leg Running": "https://www.youtube.com/watch?v=otnaWCsW8j8",
        "Straight leg run": "https://youtu.be/z9OtDkjl9Qg",
        "Power Gallops": "https://www.youtube.com/shorts/u6C5J5AXlFs",
        
        # Acceleration Drills
        "Seated Acceleration Drill": "https://youtube.com/shorts/Pt3WE7YHjwI?feature=share",
        "Band resisted angle step + sprint": "https://youtu.be/PJa3fvAnpxE",
        "Drop Back Burst Sprints": "https://www.youtube.com/watch?v=cyln4C5DAGw",
        
        # Sprint Training
        "Push Up Sprints": "https://youtu.be/RDp1fbXm8H8",
        "20 Yard Sprint-ALL OUT SPRINT": "https://youtu.be/5nKe4dhIrqg",
        "25 Yard Sprint-ALL OUT SPRINT": "https://youtu.be/5nKe4dhIrqg",
        "40 Yard Sprint-ALL OUT SPRINT": "https://youtu.be/5nKe4dhIrqg",
        "Switching Gear Sprints": "https://youtu.be/q7U7PHYzcQw",
        "Sprint Build ups": "https://youtu.be/2jta64DZaEQ",
        "Snake Sprints": "https://www.youtube.com/watch?v=2NPc6loEWO4",
        
        # Medicine Ball Exercises
        "Medball Alternating Drop Backs": "https://youtu.be/-hFbi1zxQ1U",
        "Rotational Overhead MB Slams": "https://youtu.be/0j0NN8xE02o",
        
        # Change of Direction Drills
        "5-10-5 COD Drill": "https://youtu.be/dkVdcMFauP0",
        "Open Up Change of Direction Drill": "https://youtube.com/shorts/3ySeoDA1AvQ?feature=share",
        "Cirlce Change of Direction": "https://www.youtube.com/watch?v=yX8DbwTJvPI",
        "Quick Burst Reactive Change of Direction Drill": "https://youtube.com/shorts/BaoeFJotIzU?feature=share",
        "Tracking Drill With Crossover": "https://youtube.com/shorts/KVhJcVi7Rvc?feature=share",
        
        # Additional exercises found in the extraction
        "Hill Sprints (reinforces acceleration angles)": "https://youtu.be/5nKe4dhIrqg",  # Using sprint video as reference
        "8 Meter Curved Sprints": "https://www.youtube.com/watch?v=2NPc6loEWO4",  # Using snake sprints as similar
    }
    
    return video_mapping

def normalize_exercise_name(name):
    """Normalize exercise name for better matching"""
    # Remove block prefixes (A1), A2), B1), etc.
    normalized = re.sub(r'^[A-Z]\d+\)\s*', '', name)
    # Remove extra whitespace
    normalized = ' '.join(normalized.split())
    return normalized

def find_video_url(exercise_name, video_mapping):
    """Find the appropriate video URL for an exercise"""
    normalized_name = normalize_exercise_name(exercise_name)
    
    # Direct match first
    if normalized_name in video_mapping:
        return video_mapping[normalized_name]
    
    # Partial matches for complex exercise names
    for key, url in video_mapping.items():
        # Check if key words match
        if key.lower() in normalized_name.lower() or normalized_name.lower() in key.lower():
            # Special handling for specific cases
            if "hurdle hop" in normalized_name.lower() and "hurdle hop" in key.lower():
                return url
            elif "sprint" in normalized_name.lower() and "sprint" in key.lower():
                # Match sprint distances
                if "20 yard" in normalized_name.lower() and "20 yard" in key.lower():
                    return url
                elif "25 yard" in normalized_name.lower() and "25 yard" in key.lower():
                    return url
                elif "40 yard" in normalized_name.lower() and "40 yard" in key.lower():
                    return url
                elif "sprint" in normalized_name.lower() and len(key.split()) <= 3:
                    return url
            elif key.lower().replace(" ", "") in normalized_name.lower().replace(" ", ""):
                return url
    
    return None

def merge_video_links():
    """Merge video links into the training plan JSON"""
    
    # Load the training plan
    with open('docs/training-plan.json', 'r', encoding='utf-8') as f:
        training_plan = json.load(f)
    
    # Create video mapping
    video_mapping = create_video_mapping()
    
    # Statistics
    total_exercises = 0
    matched_exercises = 0
    unmatched_exercises = []
    
    print("Merging video links into training plan...")
    print("=" * 60)
    
    # Process each week
    for week in training_plan['weeks']:
        week_num = week['week_number']
        print(f"\nProcessing Week {week_num}:")
        
        # Process each day
        for day in week['days']:
            day_num = day['day_number']
            focus = day['focus']
            print(f"  Day {day_num} ({focus}):")
            
            # Process each block
            for block in day['blocks']:
                block_name = block['block_name']
                
                # Process each exercise
                for exercise in block['exercises']:
                    exercise_name = exercise['name']
                    total_exercises += 1
                    
                    # Find matching video URL
                    video_url = find_video_url(exercise_name, video_mapping)
                    
                    if video_url:
                        exercise['video_url'] = video_url
                        matched_exercises += 1
                        print(f"    ✓ {exercise_name}")
                    else:
                        unmatched_exercises.append({
                            'week': week_num,
                            'day': day_num,
                            'block': block_name,
                            'exercise': exercise_name
                        })
                        print(f"    ✗ {exercise_name}")
    
    # Save the updated training plan
    with open('docs/training-plan.json', 'w', encoding='utf-8') as f:
        json.dump(training_plan, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "=" * 60)
    print("MERGE SUMMARY")
    print("=" * 60)
    print(f"Total exercises: {total_exercises}")
    print(f"Matched with videos: {matched_exercises}")
    print(f"Unmatched: {len(unmatched_exercises)}")
    print(f"Success rate: {(matched_exercises/total_exercises)*100:.1f}%")
    
    if unmatched_exercises:
        print(f"\nUnmatched exercises ({len(unmatched_exercises)}):")
        for item in unmatched_exercises:
            print(f"  Week {item['week']}, Day {item['day']}: {item['exercise']}")
    
    print(f"\nUpdated training plan saved to: docs/training-plan.json")
    
    return training_plan, matched_exercises, unmatched_exercises

if __name__ == "__main__":
    merge_video_links() 