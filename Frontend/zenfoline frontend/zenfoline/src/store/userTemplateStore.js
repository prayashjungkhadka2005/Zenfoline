import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAPI } from '../utils/fetchAPIs';
import useAuthStore from './userAuthStore';

const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: [], //stores all templates
      activeTemplateId: null, //stores active templates
      loading: false, 
      error: null,
      hasCheckedActiveTemplate: false,
      lastUserId: null, // Track the last user ID to detect user changes

      // fetching all templates and active templates
      fetchTemplates: async (userId) => {
        // Get current state
        const currentState = get();
        
        // If the user ID has changed, reset the store
        if (currentState.lastUserId !== userId) {
          set({
            templates: [],
            activeTemplateId: null,
            hasCheckedActiveTemplate: false,
            lastUserId: userId
          });
        }
        
        // Only skip fetching if we have templates and we've already checked for active template
        // AND we're still for the same user
        if (currentState.templates.length > 0 && 
            currentState.hasCheckedActiveTemplate && 
            currentState.lastUserId === userId) {
          return;
        }
        
        set({ loading: true, error: null });
        try {
          const templates = await fetchAPI('http://localhost:3000/authenticated-user/templates');

          const userResponse = await fetchAPI(
            `http://localhost:3000/authenticated-user/getactivetemplate?userId=${userId}`
          );

          // Ensure activeTemplateId is null if not explicitly set
          const activeTemplateId = userResponse.activeTemplateId || null;

          // Only sort if there's an active template
          const sortedTemplates = activeTemplateId 
            ? templates.sort((a, b) => {
                if (a._id === activeTemplateId) return -1;
                if (b._id === activeTemplateId) return 1;
                return 0;
              })
            : templates; // Keep original order if no active template

          // Set the state with the correct activeTemplateId and mark that we've checked
          set({ 
            templates: sortedTemplates, 
            activeTemplateId: activeTemplateId,
            hasCheckedActiveTemplate: true,
            lastUserId: userId,
            error: null 
          });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      fetchActiveTemplate: async (userId) => {
        try {
          const response = await fetch(
            `http://localhost:3000/authenticated-user/activetemplate?userId=${userId}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch active template');
          }
          const activeTemplate = await response.json();
          set({ activeTemplateId: activeTemplate._id });
          return activeTemplate;
        } catch (err) {
          console.error(err.message);
          return null;
        }
      },
      

      activateTemplate: async (templateId, userId) => {
        try {
          await fetchAPI('http://localhost:3000/authenticated-user/activateusertemplate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId, userId }),
          });

          
          set((state) => {
            const updatedTemplates = state.templates.sort((a, b) => {
              if (a._id === templateId) return -1;
              if (b._id === templateId) return 1;
              return 0;
            });
            return { templates: updatedTemplates, activeTemplateId: templateId, error: null };
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      updateTheme: async(templateId, userId) => {
        try {
          const response = await fetch('http://localhost:3000/authenticated-user/updatetheme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              templateId, 
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to update theme database.');
          }
    
          console.log('Theme updated successfully');
        } catch (err) {
          console.error('Error updating theme:', err.message);
        }
      }
    }),
    {
      name: 'user-template-store',
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)), 
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);

export default useTemplateStore;
