import DynamicFormRenderer from "./_components/form-renderer";

const App = () => {
  const formConfig1 = {
    "title": "Enhanced Dynamic Registration Form 🚀",
    "description": "Complete your registration with our intelligent multi-step form. Fields marked with an asterisk (*) are required.",
    "type": "wizard",
    "submitButtonLabel": "Complete Registration",
    "theme": {
      "primaryColor": "#3b82f6",
      "secondaryColor": "#f3f4f6",
      "layout": "adaptive",
      "fieldSpacing": "medium",
      "borderRadius": "lg",
      "animation": "smooth"
    },
    "onSubmit": {
      "action": "API_CALL",
      "url": "/api/users/register",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "X-API-Version": "v2"
      },
      "successMessage": "🎉 Your account has been created successfully! Welcome aboard!",
      "redirectOnSuccess": "/dashboard",
      "errorMessage": "❌ An error occurred while creating your account. Please try again.",
      "loadingMessage": "Creating your account...",
      "validationMode": "onBlur"
    },
    "steps": [
      {
        "id": "personal",
        "title": "Personal Information",
        "description": "Let's start with some basic information about you",
        "icon": "user",
        "fields": ["personalInfo", "contactDetails"]
      },
      {
        "id": "preferences",
        "title": "Preferences & Interests",
        "description": "Tell us about your preferences and interests",
        "icon": "settings",
        "fields": ["userPreferences", "interestsSection"]
      },
      {
        "id": "security",
        "title": "Security & Verification",
        "description": "Secure your account and add emergency contacts",
        "icon": "shield",
        "fields": ["securitySection", "emergencyContacts"]
      }
    ],
    "fields": [
      {
        "name": "personalInfo",
        "type": "section",
        "title": "👤 Personal Details",
        "description": "Your basic personal information",
        "columns": 2,
        "collapsible": false,
        "fields": [
          {
            "name": "fullName",
            "label": "Full Name*",
            "type": "text",
            "placeholder": "e.g., John Doe",
            "helpText": "Enter your full legal name as it appears on official documents",
            "tooltip": "This will be used for account verification purposes",
            "validation": {
              "required": {
                "value": true,
                "message": "Full name is required."
              },
              "minLength": {
                "value": 2,
                "message": "Name must be at least 2 characters long."
              },
              "maxLength": {
                "value": 50,
                "message": "Name cannot exceed 50 characters."
              },
              "pattern": {
                "value": "^[a-zA-Z\\s'-]+$",
                "message": "Name can only contain letters, spaces, hyphens, and apostrophes."
              },
              "custom": {
                "function": "validateFullName",
                "message": "Please enter both first and last name."
              }
            }
          },
          {
            "name": "email",
            "label": "Email Address*",
            "type": "email",
            "placeholder": "e.g., user@example.com",
            "helpText": "We'll use this email for account notifications and login",
            "tooltip": "Make sure you have access to this email address",
            "validation": {
              "required": {
                "value": true,
                "message": "Email is required."
              },
              "pattern": {
                "value": "^\\S+@\\S+\\.\\S+$",
                "message": "Please enter a valid email address."
              }
            }
          },
          {
            "name": "age",
            "label": "Age*",
            "type": "number",
            "placeholder": "e.g., 25",
            "helpText": "You must be at least 18 years old to register",
            "validation": {
              "required": {
                "value": true,
                "message": "Age is required."
              },
              "min": {
                "value": 18,
                "message": "You must be at least 18 years old."
              },
              "max": {
                "value": 120,
                "message": "Please enter a valid age."
              }
            }
          },
          {
            "name": "dob",
            "label": "Date of Birth",
            "type": "date",
            "helpText": "Optional: Helps us provide age-appropriate content"
          }
        ]
      },
      {
        "name": "contactDetails",
        "type": "section",
        "title": "📍 Contact Information",
        "description": "Where can we reach you?",
        "columns": 1,
        "fields": [
          {
            "name": "country",
            "label": "Country*",
            "type": "select",
            "placeholder": "Select your country",
            "helpText": "This helps us provide region-specific features",
            "validation": {
              "required": {
                "value": true,
                "message": "Country is required."
              }
            },
            "options": [
              { "value": "us", "label": "United States" },
              { "value": "ca", "label": "Canada" },
              { "value": "uk", "label": "United Kingdom" },
              { "value": "au", "label": "Australia" },
              { "value": "in", "label": "India" }
            ]
          },
          {
            "name": "state",
            "label": "State/Province*",
            "type": "select",
            "placeholder": "Select your state/province",
            "helpText": "Choose your state or province",
            "validation": {
              "required": {
                "value": true,
                "message": "State/Province is required."
              }
            },
            "optionsSource": {
              "function": "getCountryStates",
              "dependsOn": "country",
              "cache": true,
              "cacheTimeout": 300
            },
            "showWhen": {
              "conditions": [
                { "field": "country", "operator": "neq", "value": undefined }
              ]
            }
          },
          {
            "name": "phoneNumber",
            "label": "Phone Number",
            "type": "tel",
            "placeholder": "+1 (555) 123-4567",
            "helpText": "Optional: For account security and important notifications",
            "validation": {
              "pattern": {
                "value": "^[+]?[1-9]\\d{1,14}$",
                "message": "Please enter a valid phone number."
              }
            }
          }
        ]
      },
      {
        "name": "securitySection",
        "type": "section",
        "title": "🔐 Account Security",
        "description": "Secure your account with a strong password",
        "columns": 1,
        "fields": [
          {
            "name": "password",
            "label": "Password*",
            "type": "password",
            "placeholder": "Enter a strong password",
            "helpText": "Must be 8-32 characters with uppercase, lowercase, number, and special character",
            "tooltip": "Use a unique password you haven't used elsewhere",
            "showPasswordStrength": true,
            "validation": {
              "required": {
                "value": true,
                "message": "Password is required."
              },
              "minLength": {
                "value": 8,
                "message": "Password must be at least 8 characters long."
              },
              "maxLength": {
                "value": 32,
                "message": "Password cannot exceed 32 characters."
              },
              "custom": {
                "function": "validatePasswordStrength",
                "message": "Password must contain uppercase, lowercase, number, and special character."
              }
            }
          },
          {
            "name": "confirmPassword",
            "label": "Confirm Password*",
            "type": "password",
            "placeholder": "Re-enter your password",
            "validation": {
              "required": {
                "value": true,
                "message": "Please confirm your password."
              },
              "custom": {
                "function": "validatePasswordMatch",
                "message": "Passwords do not match."
              }
            }
          },
          {
            "name": "twoFactorAuth",
            "label": "Enable Two-Factor Authentication",
            "type": "switch",
            "defaultValue": false,
            "helpText": "Recommended: Adds an extra layer of security to your account",
            "tooltip": "You can set this up later in your account settings"
          }
        ]
      },
      {
        "name": "userPreferences",
        "type": "section",
        "title": "⚙️ User Preferences",
        "description": "Customize your experience",
        "columns": 2,
        "collapsible": true,
        "defaultCollapsed": false,
        "fields": [
          {
            "name": "bio",
            "label": "Biography",
            "type": "textarea",
            "placeholder": "Tell us a little about yourself...",
            "helpText": "Optional: Share a brief description about yourself",
            "validation": {
              "maxLength": {
                "value": 500,
                "message": "Biography cannot exceed 500 characters."
              }
            },
            "characterCounter": true
          },
          {
            "name": "profilePicture",
            "label": "Profile Picture",
            "type": "file",
            "helpText": "Upload a profile photo (optional)"
          },
          {
            "name": "themeColor",
            "label": "Profile Theme Color",
            "type": "color",
            "defaultValue": "#3b82f6",
            "helpText": "Choose your preferred theme color",
            "presetColors": ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]
          }
        ]
      },
      {
        "name": "interestsSection",
        "type": "section",
        "title": "🎯 Interests & Communication",
        "description": "Help us personalize your experience",
        "columns": 1,
        "fields": [
          {
            "name": "interests",
            "label": "Your Interests",
            "type": "checkbox",
            "helpText": "Select all that apply - this helps us show you relevant content",
            "options": [
              { "value": "tech", "label": "Technology & Programming", "icon": "💻" },
              { "value": "sports", "label": "Sports & Fitness", "icon": "⚽" },
              { "value": "art", "label": "Art & Culture", "icon": "🎨" },
              { "value": "travel", "label": "Travel & Adventure", "icon": "✈️" },
              { "value": "music", "label": "Music & Entertainment", "icon": "🎵" },
              { "value": "cooking", "label": "Cooking & Food", "icon": "🍳" },
              { "value": "reading", "label": "Reading & Literature", "icon": "📚" },
              { "value": "gaming", "label": "Gaming", "icon": "🎮" }
            ],
            "layout": "grid",
            "columns": 2
          },
          {
            "name": "contactMethod",
            "label": "Preferred Contact Method*",
            "type": "radio",
            "defaultValue": "email",
            "helpText": "Choose how you'd prefer to receive important notifications",
            "validation": {
              "required": {
                "value": true,
                "message": "Please select a contact method."
              }
            },
            "options": [
              { "value": "email", "label": "Email", "description": "Most reliable for important updates" },
              { "value": "sms", "label": "SMS", "description": "Quick notifications to your phone" },
              { "value": "phone", "label": "Phone Call", "description": "For urgent matters only" },
              { "value": "app", "label": "In-App Notifications", "description": "Within the application only" }
            ]
          },
          {
            "name": "newsletter",
            "label": "Marketing Communications",
            "type": "switch",
            "defaultValue": false,
            "helpText": "Receive updates about new features, tips, and special offers"
          },
          {
            "name": "referralSource",
            "label": "How did you hear about us?",
            "type": "select",
            "placeholder": "Please select...",
            "showWhen": {
              "conditions": [
                { "field": "newsletter", "operator": "eq", "value": true }
              ]
            },
            "options": [
              { "value": "social_media", "label": "Social Media" },
              { "value": "search_engine", "label": "Search Engine" },
              { "value": "friend_referral", "label": "Friend/Colleague Referral" },
              { "value": "advertisement", "label": "Online Advertisement" },
              { "value": "blog_article", "label": "Blog/Article" },
              { "value": "other", "label": "Other" }
            ]
          }
        ]
      },
      {
        "name": "emergencyContacts",
        "type": "repeatable",
        "sectionTitle": "🚨 Emergency Contacts",
        "description": "Add people we can contact in case of emergency",
        "addButtonLabel": "➕ Add Emergency Contact",
        "removeButtonLabel": "❌ Remove Contact",
        "maxItems": 3,
        "validation": {
          "min": {
            "value": 1,
            "message": "At least one emergency contact is required."
          },
          "max": {
            "value": 3,
            "message": "You can add up to 3 emergency contacts."
          }
        },
        "fields": [
          {
            "name": "contactName",
            "label": "Contact Name*",
            "type": "text",
            "placeholder": "e.g., Jane Doe",
            "validation": {
              "required": {
                "value": true,
                "message": "Contact name is required."
              },
              "minLength": {
                "value": 2,
                "message": "Name must be at least 2 characters long."
              }
            }
          },
          {
            "name": "contactPhone",
            "label": "Contact Phone*",
            "type": "tel",
            "placeholder": "e.g., +1 (555) 123-4567",
            "validation": {
              "required": {
                "value": true,
                "message": "Contact phone is required."
              },
              "pattern": {
                "value": "^[+]?[1-9]\\d{1,14}$",
                "message": "Please enter a valid phone number."
              }
            }
          },
          {
            "name": "contactEmail",
            "label": "Contact Email",
            "type": "email",
            "placeholder": "e.g., jane@example.com",
            "validation": {
              "pattern": {
                "value": "^\\S+@\\S+\\.\\S+$",
                "message": "Please enter a valid email address."
              }
            }
          },
          {
            "name": "relationship",
            "label": "Relationship*",
            "type": "select",
            "placeholder": "Select relationship",
            "validation": {
              "required": {
                "value": true,
                "message": "Please specify the relationship."
              }
            },
            "options": [
              { "value": "spouse", "label": "Spouse/Partner" },
              { "value": "parent", "label": "Parent" },
              { "value": "sibling", "label": "Sibling" },
              { "value": "child", "label": "Child" },
              { "value": "friend", "label": "Friend" },
              { "value": "colleague", "label": "Colleague" },
              { "value": "other", "label": "Other" }
            ]
          },
          {
            "name": "contactType",
            "label": "Contact Type*",
            "type": "select",
            "placeholder": "Select contact type",
            "validation": {
              "required": {
                "value": true,
                "message": "Contact type is required."
              }
            },
            "options": [
              { "value": "emergency", "label": "Emergency Contact" },
              { "value": "medical", "label": "Medical Contact" },
              { "value": "work", "label": "Work Contact" },
              { "value": "personal", "label": "Personal Contact" }
            ]
          },
          {
            "name": "contactAvailability",
            "label": "Best Time to Contact",
            "type": "select",
            "placeholder": "Select preferred time",
            "helpText": "When is this person usually available?",
            "showWhen": {
              "conditions": [
                { "field": "contactType", "operator": "in", "value": ["emergency", "medical"] }
              ]
            },
            "options": [
              { "value": "anytime", "label": "Anytime" },
              { "value": "business_hours", "label": "Business Hours (9 AM - 5 PM)" },
              { "value": "evenings", "label": "Evenings (5 PM - 9 PM)" },
              { "value": "weekends", "label": "Weekends Only" }
            ]
          },
          {
            "name": "isPrimary",
            "label": "Primary Emergency Contact",
            "type": "switch",
            "defaultValue": false,
            "helpText": "This person will be contacted first in emergencies"
          }
        ]
      }
    ]
  };

  const formConfig = {
    "title": "Custom Multi‑Field Form",
    "description": "Submit data with dynamic fields and validation",
    "type": "standard",
    "submitButtonLabel": "Submit",
    "theme": {
      "primaryColor": "#2563eb",
      "secondaryColor": "#f9fafb",
      "layout": "standard",
      "fieldSpacing": "medium",
      "borderRadius": "md",
      "animation": "none"
    },
    "onSubmit": {
      "action": "API_CALL",
      "url": "/submitCustomForm",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "successMessage": "✅ Form submitted successfully!",
      "errorMessage": "⚠️ Failed to submit the form. Please check errors.",
      "loadingMessage": "Submitting...",
      "validationMode": "onSubmit"
    },
    "fields": [
      {
        "name": "Seat Pool Definition",
        "type": "section",
        "title": "Pool Details",
        "collapsible": false,
        "fields": [
          {
            "name": "name",
            "label": "Name*",
            "type": "text",
            "placeholder": "Enter your name",
            "validation": {
              "required": {
                "value": true,
                "message": "Name is required"
              },
              "minLength": {
                "value": 1,
                "message": "Name is required"
              },
              "maxLength": {
                "value": 100,
                "message": "Name must be under 100 characters"
              }
            }
          },
          {
            "name": "description",
            "label": "Description*",
            "type": "textarea",
            "placeholder": "Describe your form details...",
            "validation": {
              "required": {
                "value": true,
                "message": "Description is required"
              },
              "minLength": {
                "value": 20,
                "message": "Description must be at least 20 characters"
              }
            },
            "editor": {
              "library": "tiptap",
              "options": {
                "extensions": [
                  "StarterKit",
                  "Link",
                  "Image"
                ],
                "toolbar": [
                  "bold",
                  "italic",
                  "bulletList",
                  "link",
                  "image"
                ]
              }
            }
          },
          {
            "name": "type",
            "label": "Type*",
            "type": "select",
            "validation": {
              "required": {
                "value": true,
                "message": "Type is required"
              }
            },
            "options": [
              {
                "label": "Static",
                "value": "static"
              },
              {
                "label": "Dynamic",
                "value": "dynamic"
              }
            ]
          },
          {
            "name": "state",
            "label": "State*",
            "type": "select",
            "validation": {
              "required": {
                "value": true,
                "message": "State is required"
              }
            },
            "options": [
              {
                "label": "New",
                "value": "new"
              },
              {
                "label": "In Progress",
                "value": "in_progress"
              },
              {
                "label": "Completed",
                "value": "completed"
              }
            ]
          },
          {
            "name": "term",
            "label": "Term*",
            "type": "select",
            "validation": {
              "required": {
                "value": true,
                "message": "Term is required"
              }
            },
            "options": [
              {
                "label": "Short",
                "value": "short"
              },
              {
                "label": "Medium",
                "value": "medium"
              },
              {
                "label": "Long",
                "value": "long"
              }
            ]
          },
          {
            "name": "milestoneType",
            "label": "Milestone Type*",
            "type": "select",
            "validation": {
              "required": {
                "value": true,
                "message": "Milestone type is required"
              }
            },
            "options": [
              {
                "label": "Phase 1",
                "value": "phase1"
              },
              {
                "label": "Phase 2",
                "value": "phase2"
              },
              {
                "label": "Phase 3",
                "value": "phase3"
              }
            ]
          },
          {
            "name": "populationGroup",
            "label": "Population Group*",
            "type": "select",
            "options": [],
            "optionsSource": {
              "function": "getPopulationGroups",
              "labelKey": "groupName",
              "valueKey": "groupId",
              "sourceProperty": "groups",
              "cache": true
            },
            "validation": {
              "required": {
                "value": true,
                "message": "Population Group is required"
              }
            }
          },
          {
            "name": "populationSubgroup",
            "label": "Population Subgroup*",
            "type": "select",
            "options": [],
            // "showWhen": {
            //   "conditions": [
            //     {
            //       "field": "populationGroup",
            //       "operator": "neq",
            //       "value":undefined
            //     }
            //   ]
            // },
            "optionsSource": {
              "function": "getPopulationSubgroups",
              "labelKey": "subgroupName",
              "valueKey": "subgroupId",
              "sourceProperty": "subgroups",
              "cache": true,
              "dependsOn": "populationGroup"
            },
            "validation": {
              "required": {
                "value": true,
                "message": "Population Subgroup is required"
              }
            }
          },
          {
            "name": "population",
            "label": "Population*",
            "type": "select",
            "options": [],
            // "showWhen": {
            //   "conditions": [
            //     {
            //       "field": "populationSubgroup",
            //       "operator": "neq",
            //       "value":undefined
            //     }
            //   ]
            // },
            "optionsSource": {
              "function": "getPopulations",
              "labelKey": "itemName",
              "valueKey": "itemId",
              "sourceProperty": "items",
              "cache": true,
              "dependsOn": "populationSubgroup"
            },
            "validation": {
              "required": {
                "value": true,
                "message": "Population is required"
              }
            }
          },
          {
            "name": "count",
            "label": "Count*",
            "type": "number",
            "placeholder": "e.g. 10",
            "validation": {
              "required": {
                "value": true,
                "message": "Count is required"
              },
              "min": {
                "value": 0,
                "message": "Count must be zero or greater"
              }
            }
          },
          {
            "name": "isPercentage",
            "label": "Is Percentage?",
            "type": "radio",
            "validation": {
              "required": {
                "value": true,
                "message": "Please choose Yes or No"
              }
            },
            "options": [
              {
                "label": "Yes",
                "value": 'yes'
              },
              {
                "label": "No",
                "value": 'no'
              }
            ]
          },
          {
            "name": "percentage",
            "label": "Percentage",
            "type": "number",
            "placeholder": "0-100",
            "showWhen": {
              "conditions": [
                {
                  "field": "isPercentage",
                  "operator": "eq",
                  "value": 'yes'
                }
              ]
            },
            "validation": {
              "min": {
                "value": 0,
                "message": "Percentage must be ≥ 0"
              },
              "max": {
                "value": 100,
                "message": "Percentage cannot exceed 100"
              }
            }
          },
          {
            "name": "marks",
            "label": "Marks",
            "type": "number",
            "placeholder": "e.g. 50",
            "showWhen": {
              "conditions": [
                {
                  "field": "isPercentage",
                  "operator": "eq",
                  "value": 'no'
                }
              ]
            },
            "validation": {
              "min": {
                "value": 0,
                "message": "Marks must be zero or greater"
              }
            }
          }
        ],
      }
    ],

    "validation": {
      "mode": "onSubmit",
      "showErrorsOn": "submit",
      "validateOnChange": false
    },
    "accessibility": {
      "announceValidationErrors": true,
      "keyboardNavigation": true,
      "screenReaderSupport": true,
      "highContrastMode": "auto"
    },
    "analytics": {
      "trackFieldInteractions": true,
      "trackValidationErrors": true,
      "trackFormAbandonment": false,
      "trackStepCompletion": false
    },
    "localization": {
      "defaultLanguage": "en",
      "supportedLanguages": [
        "en"
      ],
      "dateFormat": "auto",
      "numberFormat": "auto"
    },
    "customFunctions": {
      "getPopulationGroups": {
        "description": "Fetch list of population groups",
        "async": true
      },
      "getPopulationSubgroups": {
        "description": "Fetch list of subgroups for selected group",
        "async": true
      },
      "getPopulations": {
        "description": "Fetch list of populations for selected subgroup",
        "async": true
      }
    }
  };

  const jsonString = JSON.stringify(formConfig);
  const parsedJson = JSON.parse(jsonString);
  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicFormRenderer formConfig={parsedJson} />
    </div>
  );
};

export default App;