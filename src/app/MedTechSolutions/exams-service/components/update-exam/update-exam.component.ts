import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamsService} from '../../service/exams.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update-exam',
  templateUrl: './update-exam.component.html',
  styleUrl: './update-exam.component.css'
})
export class UpdateExamComponent {
  examUrl: string = '';
  examId: number = -1;

  constructor(private examsService: ExamsService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.examId = +id;
      }
    });
  }

  onSubmit(): void {
    if (this.examUrl && this.isValidUrl(this.examUrl) && this.examId !== -1) {
      const updatedData = {
        examResultsUrl: this.examUrl,
        examResultsReady: true
      };

      this.examsService.updateExam(this.examId, updatedData).subscribe(
        response => {
          console.log('Examen actualizado correctamente:', response);
          this.location.back();
        },
        error => {
          console.error('Error al actualizar el examen:', error);
        }
      );
    } else {
      console.error('La URL ingresada no es válida o no se ha proporcionado un ID de examen');
    }
  }

  goBack(): void {
    this.location.back();
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

}
