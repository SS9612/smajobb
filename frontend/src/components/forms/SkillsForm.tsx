import React from 'react';

interface SkillsFormProps {
  skills: string[];
  onSkillAdd: (skill: string) => void;
  onSkillRemove: (skill: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onSkillAdd,
  onSkillRemove
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        onSkillAdd(value);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Färdigheter</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lägg till färdigheter
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => onSkillRemove(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Skriv en färdighet och tryck Enter"
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Tryck Enter för att lägga till en färdighet
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
