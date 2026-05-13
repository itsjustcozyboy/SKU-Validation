// lib/storage.ts
// localStorage 기반 데이터 저장소

export class StorageManager {
  private static prefix = 'sku_validation_';

  private static getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  static setJSON(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static getJSON<T>(key: string, defaultValue?: T): T | undefined {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage error:', e);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.getKey(key));
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// SKUProject 저장소
export class ProjectStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('projects', []) || [];
  }

  static getById(id: string) {
    const projects = this.getAll();
    return projects.find(p => p.id === id);
  }

  static save(project: any) {
    const projects = this.getAll();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.push(project);
    }
    StorageManager.setJSON('projects', projects);
    return project;
  }

  static delete(id: string) {
    const projects = this.getAll();
    StorageManager.setJSON('projects', projects.filter(p => p.id !== id));
  }
}

// SKUCandidate 저장소
export class CandidateStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('candidates', []) || [];
  }

  static getById(id: string) {
    const candidates = this.getAll();
    return candidates.find(c => c.id === id);
  }

  static getByProjectId(projectId: string) {
    const candidates = this.getAll();
    return candidates.filter(c => c.projectId === projectId);
  }

  static save(candidate: any) {
    const candidates = this.getAll();
    const idx = candidates.findIndex(c => c.id === candidate.id);
    if (idx >= 0) {
      candidates[idx] = candidate;
    } else {
      candidates.push(candidate);
    }
    StorageManager.setJSON('candidates', candidates);
    return candidate;
  }

  static delete(id: string) {
    const candidates = this.getAll();
    StorageManager.setJSON('candidates', candidates.filter(c => c.id !== id));
  }
}

// Campaign 저장소
export class CampaignStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('campaigns', []) || [];
  }

  static getById(id: string) {
    const campaigns = this.getAll();
    return campaigns.find(c => c.id === id);
  }

  static getBySkuCandidateId(skuCandidateId: string) {
    const campaigns = this.getAll();
    return campaigns.find(c => c.skuCandidateId === skuCandidateId);
  }

  static save(campaign: any) {
    const campaigns = this.getAll();
    const idx = campaigns.findIndex(c => c.id === campaign.id);
    if (idx >= 0) {
      campaigns[idx] = campaign;
    } else {
      campaigns.push(campaign);
    }
    StorageManager.setJSON('campaigns', campaigns);
    return campaign;
  }

  static delete(id: string) {
    const campaigns = this.getAll();
    StorageManager.setJSON('campaigns', campaigns.filter(c => c.id !== id));
  }
}

// Event 저장소
export class EventStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('events', []) || [];
  }

  static save(event: any) {
    const events = this.getAll();
    events.push(event);
    StorageManager.setJSON('events', events);
    return event;
  }

  static getBySkuCandidateId(skuCandidateId: string) {
    const events = this.getAll();
    return events.filter(e => e.skuCandidateId === skuCandidateId);
  }
}

// Lead 저장소
export class LeadStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('leads', []) || [];
  }

  static save(lead: any) {
    const leads = this.getAll();
    leads.push(lead);
    StorageManager.setJSON('leads', leads);
    return lead;
  }

  static getBySkuCandidateId(skuCandidateId: string) {
    const leads = this.getAll();
    return leads.filter(l => l.skuCandidateId === skuCandidateId);
  }
}

// SurveyResponse 저장소
export class SurveyStorage {
  static getAll(): any[] {
    return StorageManager.getJSON<any[]>('surveys', []) || [];
  }

  static save(survey: any) {
    const surveys = this.getAll();
    surveys.push(survey);
    StorageManager.setJSON('surveys', surveys);
    return survey;
  }

  static getBySkuCandidateId(skuCandidateId: string) {
    const surveys = this.getAll();
    return surveys.filter(s => s.skuCandidateId === skuCandidateId);
  }
}
